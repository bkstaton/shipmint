import csv from 'csv-parse/lib/sync';
import moment from 'moment';

import { DiscountType } from '../../types/fedex';
import { Shipment, ShipmentDiscount, ShipmentSurcharge, Carrier } from '../../../models';

export enum Columns {
    TrackingNumber = 8,
    ServiceType = 11,
    GroundService = 12,
    InvoiceDate = 1,
    ShipmentDate = 13,
    TransportationCharge = 9,
    Weight = 20,
    FirstDiscountStart = 105,
}

const parseCsvFloat = (value?: string): number => {
    if (!value || !value.length) {
        return 0;
    }

    return parseFloat(value.replace(/ /g, '')) || 0;
};

const fedexParse = async (customerId: string, data: Buffer): Promise<void> => {
    let rows: Array<string>[];
    try {
        try {
            rows = csv(data, {
                delimiter: ';',
                from_line: 2,
                relax_column_count: true,
            });
        }
        catch (e) {
            rows = csv(data, {
                delimiter: ',',
                from_line: 2,
                relax_column_count: true,
            });
        }
    } catch (e) {
        console.log(e);

        throw new Error('Failed parsing CSV file.');
    }

    const shipments = {} as { [key : string]: Shipment };
    const discounts = {} as { [key : string]: ShipmentDiscount };
    const surcharges = {} as { [key : string]: ShipmentSurcharge };

    for (let row of rows) {
        const trackingNumber = row[Columns.TrackingNumber];

        const invoiceDate = moment(row[Columns.InvoiceDate], 'YYYYMMDD').toDate();
        const shipmentDate = moment(row[Columns.ShipmentDate], 'YYYYMMDD').toDate();

        const serviceType = row[Columns.ServiceType];
        const groundService = row[Columns.GroundService];

        const transportationCharge = parseCsvFloat(row[Columns.TransportationCharge]);
        const weight = parseCsvFloat(row[Columns.Weight]);

        let shipment: Shipment;
        if (Object.keys(shipments).includes(`${customerId}-${invoiceDate}-${trackingNumber}`)) {
            shipment = shipments[`${customerId}-${invoiceDate}-${trackingNumber}`];
        } else {
            [ shipment ] = await Shipment.findOrCreate({
                where: {
                    customerId,
                    invoiceDate,
                    trackingNumber,
                },
                defaults: {
                    carrier: Carrier.FedEx,
                    carrierMetadata: {
                        serviceType,
                        groundService,
                    },
                    shipmentDate,
                    transportationCharge: 0,
                    weight: 0,
                },
            });

            shipment.transportationCharge = 0;
            shipment.weight = 0;

            shipments[`${customerId}-${invoiceDate}-${trackingNumber}`] = shipment;
        }

        shipment.transportationCharge += transportationCharge;
        shipment.weight += weight;

        await shipment.save();

        for (let i = Columns.FirstDiscountStart; i < row.length; i += 2) {
            // If the name is a valid discount type, aggregate it that way
            if (Object.values(DiscountType).includes(row[i] as DiscountType)) {
                let shipmentDiscount: ShipmentDiscount;
                if (Object.keys(discounts).includes(`${shipment.id}-${row[i]}`)) {
                    shipmentDiscount = discounts[`${shipment.id}-${row[i]}`];
                } else {
                    [ shipmentDiscount ] = await ShipmentDiscount.findOrCreate({
                        where: {
                            shipmentId: shipment.id,
                            type: row[i],
                        },
                        defaults: {
                            amount: 0,
                        }
                    });

                    shipmentDiscount.amount = 0;

                    discounts[`${shipment.id}-${row[i]}`] = shipmentDiscount;
                }

                shipmentDiscount.amount += parseCsvFloat(row[i + 1]);

                await shipmentDiscount.save();
            }
            else if (row[i] && row[i].length) { // Otherwise, as long as the label isn't empty it must be a surcharge
                let shipmentSurcharge: ShipmentSurcharge;
                if (Object.keys(surcharges).includes(`${shipment.id}-${row[i]}`)) {
                    shipmentSurcharge = surcharges[`${shipment.id}-${row[i]}`];
                } else {
                    [ shipmentSurcharge ] = await ShipmentSurcharge.findOrCreate({
                        where: {
                            shipmentId: shipment.id,
                            type: row[i],
                        },
                        defaults: {
                            amount: 0,
                        }
                    });

                    shipmentSurcharge.amount = 0;

                    surcharges[`${shipment.id}-${row[i]}`] = shipmentSurcharge;
                }

                shipmentSurcharge.amount += parseCsvFloat(row[i + 1]);

                await shipmentSurcharge.save();
            }
        }
    }
};

export default fedexParse;