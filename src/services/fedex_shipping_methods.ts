import sequelize, { FedexShippingMethod, FedexShippingMethodBucket } from "../models";

export interface Bucket {
    displayName: string;
    minimum: number;
    maximum: number;
}

export interface UpsertRequest {
    displayName: string;
    serviceType: string;
    groundService: string | null;
    buckets: Bucket[];
}

export const create = async (request: UpsertRequest) => {
    const t = await sequelize.transaction();

    try {
        const method = await FedexShippingMethod.create({
            displayName: request.displayName,
            serviceType: request.serviceType,
            groundService: request.groundService,
        });

        // Add Buckets to database
        await Promise.all(
            request.buckets.map(b => FedexShippingMethodBucket.create({
                ...b,
                fedexShippingMethodId: method.id,
            }))
        );

        await t.commit();

        return await mapMethodToResponse(method);
    } catch (e) {
        await t.rollback();

        throw e;
    }
};

export const find = async () => {
    const methods = await FedexShippingMethod.findAll();

    return Promise.all(methods.map(async method => {
        return await mapMethodToResponse(method);
    }));
};

export const read = async (fedexShippingMethodId: number) => {
    const method = await FedexShippingMethod.findOne({
        where: {
            id: fedexShippingMethodId,
        }
    });

    if (method === null) {
        return null; 
    }

    return await mapMethodToResponse(method);
};

export const update = async (fedexShippingMethodId: number, request: UpsertRequest) => {
    const method = await FedexShippingMethod.findOne({
        where: {
            id: fedexShippingMethodId,
        }
    });

    if (method === null) {
        return null;
    }

    const t = await sequelize.transaction();

    try {

        method.displayName = request.displayName;
        method.serviceType = request.serviceType;
        method.groundService = request.groundService;

        await method.save();

        // Remove existing buckets
        await FedexShippingMethodBucket.destroy({
            where: {
                fedexShippingMethodId,
            }
        });

        // Add all Buckets
        await Promise.all(
            request.buckets.map(b => FedexShippingMethodBucket.create({
                ...b,
                fedexShippingMethodId: method.id,
            }))
        );

        await t.commit();
    } catch (e) {
        await t.rollback();

        throw e;
    }

    return await mapMethodToResponse(method);
};

export const del = async (fedexShippingMethodId: number) => {
    await FedexShippingMethodBucket.destroy({
        where: {
            fedexShippingMethodId
        }
    });

    await FedexShippingMethod.destroy({
        where: {
            id: fedexShippingMethodId
        }
    });
};

const mapMethodToResponse = async (method: FedexShippingMethod) => {
    const buckets = await method.getBuckets();

    return {
        id: method.id,
        displayName: method.displayName,
        serviceType: method.serviceType,
        groundService: method.groundService,
        buckets: buckets.map(b => {
                return {
                id: b.id,
                displayName: b.displayName,
                minimum: b.minimum,
                maximum: b.maximum,
            };
        }),
    };
}
