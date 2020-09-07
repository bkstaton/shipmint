import { FedexShippingMethod, FedexShippingMethodBucket, Shipment, Carrier, FedexSurcharge, CustomerSurchargeDiscount, CustomerDiscount } from "../../../models";
import { surchargesGroupedByMethod } from "../../types/fedex";
import moment from "moment";

interface SummaryDiscount {
    type: string;
    amount: number;
}

interface SummaryTotal {
    method: string;
    bucket: string;
    class: string;
    order: number;
    bucketOrder: number;
    count: number;
    discounts: SummaryDiscount[];
    transportationCharge: number;
    targetDiscount: number;
}

interface SummarySurcharge {
    type: string;
    count: number;
    known: boolean;
    static: boolean;
    totalCharge: number;
    publishedCharge: number;
    actualDiscount: number;
    targetDiscount: number;
}

export interface ShipmentSummary {
    annualizationFactor: number;
    totals: SummaryTotal[];
    surcharges: SummarySurcharge[];
    startDate: string;
    endDate: string;
}

const getMethods = (method: string, altMethod: string, methods: FedexShippingMethod[]): FedexShippingMethod[] => {
    return methods.filter((m) => {
        if (method && method.length) {
            return m.serviceType === method;
        }

        return m.groundService === altMethod;
    });
};

const getBucket = (weight: number, buckets: FedexShippingMethodBucket[]): FedexShippingMethodBucket | null => {
    for (let b of buckets) {
        if (b.minimum && b.minimum > weight) {
            continue;
        }

        if (b.maximum && b.maximum < weight) {
            continue;
        }

        return b;
    }

    return null;
};

const getBucketOrder = (bucket: FedexShippingMethodBucket, buckets: FedexShippingMethodBucket[]): number => {
    const matchingBuckets = buckets
        .sort((a: FedexShippingMethodBucket, b: FedexShippingMethodBucket) => {
            if (a.minimum === null) {
                return -1;
            }
            if (b.minimum === null) {
                return 1;
            }
            return a.minimum - b.minimum;
        });

    return matchingBuckets.findIndex(b => b.id === bucket.id);
};

const calculate = async (customerId: string, carrier: Carrier): Promise<ShipmentSummary> => {
    let minDate = new Date(8640000000000000); // All dates are guaranteed to be less than this large date
    let maxDate = new Date(-8640000000000000); // All dates are guaranteed to be greater than this small date

    const shipments = await Shipment.findAll({ where: { customerId } });

    let fedexMethods: FedexShippingMethod[];
    if (carrier === Carrier.FedEx) {
        fedexMethods = await FedexShippingMethod.findAll();
    } else {
        throw new Error('Invalid carrier');
    }

    const fedexBuckets = {} as { [key: string]: FedexShippingMethodBucket[] };

    // Cache of totals and discounts, keyed with a unique string
    const totals = {} as { [key: string]: SummaryTotal };
    const surcharges = {} as { [key: string]: SummarySurcharge };

    for (const shipment of shipments) {
        if (shipment.invoiceDate < minDate) {
            minDate = shipment.invoiceDate;
        }

        if (shipment.invoiceDate > maxDate) {
            maxDate = shipment.invoiceDate;
        }

        const matchingMethods = getMethods(shipment.carrierMetadata.serviceType, shipment.carrierMetadata.groundService, fedexMethods);
        if (!matchingMethods || !matchingMethods.length) {
            continue;
        }

        let method: FedexShippingMethod | null = null;
        let bucket: FedexShippingMethodBucket | null = null;

        for (const m of matchingMethods) {
            if (!fedexBuckets[m.id]) {
                fedexBuckets[m.id] = await m.getBuckets();
            }

            bucket = getBucket(shipment.weight, fedexBuckets[m.id]);
            if (!bucket) {
                continue;
            }

            method = m;
            break;
        }

        if (!method || !bucket) {
            continue;
        }

        const bucketOrder = getBucketOrder(bucket, fedexBuckets[method.id]);

        const totalCacheKey = `${method.id}-${bucket.id}`;
        if (!Object.keys(totals).includes(totalCacheKey)) {
            totals[totalCacheKey] = await initTotal(customerId, method, bucket, bucketOrder);
        }

        const total = totals[totalCacheKey];

        total.count++;
        total.transportationCharge += shipment.transportationCharge;

        for (const shipmentDiscount of await shipment.getDiscounts()) {
                let discount = total.discounts.find(d => d.type === shipmentDiscount.type);

                if (!discount) {
                    discount = {
                        type: shipmentDiscount.type,
                        amount: 0,
                    }
                }

                discount.amount += shipmentDiscount.amount;

                total.discounts = [
                    ...total.discounts.filter(d => d.type !== shipmentDiscount.type),
                    discount,
                ];
        }

        for (const shipmentSurcharge of await shipment.getSurcharges()) {
            let surchargeType: string;

            if (surchargesGroupedByMethod.includes(shipmentSurcharge.type)) {
                surchargeType = `${shipmentSurcharge.type} - ${method.displayName}`;
            }
            else {
                surchargeType = shipmentSurcharge.type;
            }

            if (!Object.keys(surcharges).includes(surchargeType)) {
                surcharges[surchargeType] = await initSurcharge(customerId, surchargeType);
            }

            surcharges[surchargeType].count += 1;
            surcharges[surchargeType].totalCharge += shipmentSurcharge.amount;
        }
    }

    const surchargeValues = Object.values(surcharges).map((s) => {
        if (s.static) {
            // Calculate actual discount from published rate
            const totalPublishedCharge = s.publishedCharge * s.count;
            const actualDiscount = 100 * (totalPublishedCharge - s.totalCharge) / totalPublishedCharge;

            return {
                type: s.type,
                count: s.count,
                totalCharge: s.totalCharge,
                known: s.known,
                static: s.static,
                publishedCharge: s.publishedCharge,
                actualDiscount,
                targetDiscount: s.targetDiscount,
            };
        }

        // Calculate published rate from actual discount
        const totalPublishedChage = s.totalCharge / (1 - s.actualDiscount / 100);
        const publishedCharge = totalPublishedChage / s.count;

        return {
            type: s.type,
            count: s.count,
            totalCharge: s.totalCharge,
            known: s.known,
            static: s.static,
            publishedCharge,
            actualDiscount: s.actualDiscount,
            targetDiscount: s.targetDiscount,
        };
    });

    const start = moment(minDate).startOf('week');
    // Add one day so it is another full week ahead of the start rather than just 6 days
    const end = moment(maxDate).endOf('week').add(1, 'day');

    const annualizationFactor = end.diff(start, 'weeks') / 52.0;

    return {
        annualizationFactor,
        totals: Object.values(totals),
        surcharges: surchargeValues,
        startDate: start.toISOString(),
        endDate: end.toISOString(),
    };
};

const initTotal = async (customerId: string, method: FedexShippingMethod, bucket: FedexShippingMethodBucket, bucketOrder: number) => {
    const customerDiscount = await CustomerDiscount.findOne({
        where: {
            customerId,
            method: method.displayName,
            bucket: bucket.displayName,
        }
    });
    
    const total = {
        method: method.displayName,
        bucket: bucket.displayName,
        class: method.class,
        order: method.order,
        bucketOrder: bucketOrder,
        count: 0,
        discounts: [],
        transportationCharge: 0,
        targetDiscount: customerDiscount ? customerDiscount.discount : 0,
    };

    return total;
};

const initSurcharge = async (customerId: string, surchargeType: string) => {
    const surcharge = {
        type: surchargeType,
        count: 0,
        totalCharge: 0,
        known: false,
        static: false,
        publishedCharge: 0,
        actualDiscount: 0,
        targetDiscount: 0,
    } as SummarySurcharge;

    const fedexSurcharge = await FedexSurcharge.findOne({
        where: {
            type: surchargeType,
        }
    });

    if (fedexSurcharge) {
        surcharge.known = true;

        if (fedexSurcharge.charge) {
            surcharge.static = true;
            surcharge.publishedCharge = fedexSurcharge.charge;
        }
    }

    const customerSurcharge = await CustomerSurchargeDiscount.findOne({
        where: {
            customerId,
            type: surchargeType,
        }
    });

    if (customerSurcharge) {
        if (customerSurcharge.actual) {
            surcharge.actualDiscount = customerSurcharge.actual;
        }
        if (customerSurcharge.projected) {
            surcharge.targetDiscount = customerSurcharge.projected;
        }
    }

    return surcharge;
};

export default calculate;
