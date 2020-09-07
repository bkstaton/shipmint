import {
    Sequelize,
    Model,
    DataTypes,
    HasManyGetAssociationsMixin,
    HasManyAddAssociationMixin,
    HasManyHasAssociationMixin,
    HasManyCountAssociationsMixin,
    HasManyCreateAssociationMixin,
    Association,
    BelongsToGetAssociationMixin,
    BelongsToSetAssociationMixin,
    BelongsToCreateAssociationMixin,
} from "sequelize";

const sequelize = new Sequelize(process.env.CONNECTION_STRING || '');

sequelize.authenticate();

// Models

class User extends Model {
    // Sequelize-managed fields
    public readonly id!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    // Custom fields
    public name!: string;
    public email!: string;
    public googleId!: string | null;
}

class Customer extends Model {
    // Sequelize-managed fields
    public readonly id!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    // Custom fields
    public name!: string;

    // Relationships
    public getBenchmarks!: HasManyGetAssociationsMixin<Benchmark>;
    public addBenchmark!: HasManyAddAssociationMixin<Benchmark, number>;
    public hasBenchmark!: HasManyHasAssociationMixin<Benchmark, number>;
    public countBenchmarks!: HasManyCountAssociationsMixin;
    public createBenchmark!: HasManyCreateAssociationMixin<Benchmark>;

    public getInvoiceUploads!: HasManyGetAssociationsMixin<InvoiceUpload>;
    public addInvoiceUpload!: HasManyAddAssociationMixin<InvoiceUpload, number>;
    public hasInvoiceUpload!: HasManyHasAssociationMixin<InvoiceUpload, number>;
    public countInvoiceUploads!: HasManyCountAssociationsMixin;
    public createInvoiceUpload!: HasManyCreateAssociationMixin<InvoiceUpload>;

    public getShipments!: HasManyGetAssociationsMixin<Shipment>;
    public addShipment!: HasManyAddAssociationMixin<Shipment, number>;
    public hasShipment!: HasManyHasAssociationMixin<Shipment, number>;
    public countShipments!: HasManyCountAssociationsMixin;
    public createShipment!: HasManyCreateAssociationMixin<Shipment>;

    public getDiscounts!: HasManyGetAssociationsMixin<CustomerDiscount>;
    public addDiscount!: HasManyAddAssociationMixin<CustomerDiscount, number>;
    public hasDiscount!: HasManyHasAssociationMixin<CustomerDiscount, number>;
    public countDiscounts!: HasManyCountAssociationsMixin;
    public createDiscount!: HasManyCreateAssociationMixin<CustomerDiscount>;

    public getSurchargeDiscounts!: HasManyGetAssociationsMixin<CustomerDiscount>;
    public addSurchargeDiscount!: HasManyAddAssociationMixin<CustomerDiscount, number>;
    public hasSurchargeDiscount!: HasManyHasAssociationMixin<CustomerDiscount, number>;
    public countSurchargeDiscounts!: HasManyCountAssociationsMixin;
    public createSurchargeDiscount!: HasManyCreateAssociationMixin<CustomerDiscount>;

    public static associations: {
        benchmarks: Association<Customer, Benchmark>;
        shipments: Association<Customer, Shipment>;
        discounts: Association<Customer, CustomerDiscount>;
        surchargeDiscounts: Association<Customer, CustomerSurchargeDiscount>;
    }
}

class InvoiceUpload extends Model {
    // Sequelize-managed fields
    public readonly id!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    // Custom fields
    public customerId!: number;
    public file!: string;

    // Relationships
    public getCustomer!: BelongsToGetAssociationMixin<Customer>;
    public setCustomer!: BelongsToSetAssociationMixin<Customer, number>;
    public createCustomer!: BelongsToCreateAssociationMixin<Customer>;

    public static associations: {
        customer: Association<InvoiceUpload, Customer>;
    }
}

enum Carrier {
    FedEx = 'FedEx',
    UPS = 'UPS',
    USPS = 'USPS',
}

class CustomerDiscount extends Model {
    // Sequelize-managed fields
    public readonly id!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    // Custom fields
    public customerId!: number;
    public method!: string;
    public bucket!: string;
    public discount!: number;

    // Relationships
    public getCustomer!: BelongsToGetAssociationMixin<Customer>;
    public setCustomer!: BelongsToSetAssociationMixin<Customer, number>;
    public createCustomer!: BelongsToCreateAssociationMixin<Customer>;

    public static associations: {
        customer: Association<CustomerDiscount, Customer>;
    }
}

class CustomerSurchargeDiscount extends Model {
    // Sequelize-managed fields
    public readonly id!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    // Custom fields
    public customerId!: number;
    public type!: string;
    public actual!: number | null;
    public projected!: number | null;

    // Relationships
    public getCustomer!: BelongsToGetAssociationMixin<Customer>;
    public setCustomer!: BelongsToSetAssociationMixin<Customer, number>;
    public createCustomer!: BelongsToCreateAssociationMixin<Customer>;

    public static associations: {
        customer: Association<CustomerDiscount, Customer>;
    }
}

class Shipment extends Model {
    // Sequelize-managed fields
    public readonly id!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    // Custom fields
    public customerId!: number;
    public carrier!: Carrier;
    public carrierMetadata!: any;
    public trackingNumber!: string;
    public shipmentDate!: Date;
    public invoiceDate!: Date;
    public transportationCharge!: number;
    public weight!: number;

    // Relationships
    public getCustomer!: BelongsToGetAssociationMixin<Customer>;
    public setCustomer!: BelongsToSetAssociationMixin<Customer, number>;
    public createCustomer!: BelongsToCreateAssociationMixin<Customer>;

    public getDiscounts!: HasManyGetAssociationsMixin<ShipmentDiscount>;
    public addDiscount!: HasManyAddAssociationMixin<ShipmentDiscount, number>;
    public hasDiscount!: HasManyHasAssociationMixin<ShipmentDiscount, number>;
    public countDiscounts!: HasManyCountAssociationsMixin;
    public createDiscount!: HasManyCreateAssociationMixin<ShipmentDiscount>;

    public getSurcharges!: HasManyGetAssociationsMixin<ShipmentSurcharge>;
    public addSurcharge!: HasManyAddAssociationMixin<ShipmentSurcharge, number>;
    public hasSurcharge!: HasManyHasAssociationMixin<ShipmentSurcharge, number>;
    public countSurcharges!: HasManyCountAssociationsMixin;
    public createSurcharge!: HasManyCreateAssociationMixin<ShipmentSurcharge>;

    public static associations: {
        customer: Association<Shipment, Customer>;
        discounts: Association<Shipment, ShipmentDiscount>;
        surcharges: Association<Shipment, ShipmentSurcharge>;
    }
}

class ShipmentDiscount extends Model {
    // Sequelize-managed fields
    public readonly id!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    // Custom fields
    public shipmentId!: number;
    public type!: string;
    public amount!: number;

    // Relationships
    public getShipment!: BelongsToGetAssociationMixin<Shipment>;
    public setShipment!: BelongsToSetAssociationMixin<Shipment, number>;
    public createShipment!: BelongsToCreateAssociationMixin<Shipment>;

    public static associations: {
        shipment: Association<ShipmentDiscount, Shipment>;
    }
}

class ShipmentSurcharge extends Model {
    // Sequelize-managed fields
    public readonly id!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    // Custom fields
    public shipmentId!: number;
    public type!: string;
    public amount!: number;

    // Relationships
    public getShipment!: BelongsToGetAssociationMixin<Shipment>;
    public setShipment!: BelongsToSetAssociationMixin<Shipment, number>;
    public createShipment!: BelongsToCreateAssociationMixin<Shipment>;

    public static associations: {
        shipment: Association<ShipmentSurcharge, Shipment>;
    }
}

class Benchmark extends Model {
    // Sequelize-managed fields
    public readonly id!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    // Custom fields
    public customerId!: number;
    public annualizationFactor!: number;
    public file!: string;

    // Relationships
    public getTotals!: HasManyGetAssociationsMixin<BenchmarkTotal>;
    public addTotal!: HasManyAddAssociationMixin<BenchmarkTotal, number>;
    public hasTotal!: HasManyHasAssociationMixin<BenchmarkTotal, number>;
    public countTotals!: HasManyCountAssociationsMixin;
    public createTotal!: HasManyCreateAssociationMixin<BenchmarkTotal>;

    public getSurcharges!: HasManyGetAssociationsMixin<BenchmarkSurcharge>;
    public addSurcharges!: HasManyAddAssociationMixin<BenchmarkSurcharge, number>;
    public hasSurcharges!: HasManyHasAssociationMixin<BenchmarkSurcharge, number>;
    public countSurcharges!: HasManyCountAssociationsMixin;
    public createSurcharges!: HasManyCreateAssociationMixin<BenchmarkSurcharge>;

    public getCustomer!: BelongsToGetAssociationMixin<Customer>;
    public setCustomer!: BelongsToSetAssociationMixin<Customer, number>;
    public createCustomer!: BelongsToCreateAssociationMixin<Customer>;

    public static associations: {
        customer: Association<Benchmark, Customer>;
        totals: Association<Benchmark, BenchmarkTotal>;
        discounts: Association<Benchmark, BenchmarkDiscount>;
        surcharges: Association<Benchmark, BenchmarkSurcharge>;
    };
}

class BenchmarkTotal extends Model {
    // Sequelize-managed fields
    public readonly id!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    // Custom fields
    public benchmarkId!: number;
    public order!: number;
    public bucketOrder!: number;
    public method!: string;
    public bucket!: string;
    public class!: string;
    public count!: number;
    public transportationCharge!: number;
    public targetDiscount!: number;

    public getDiscounts!: HasManyGetAssociationsMixin<BenchmarkDiscount>;
    public addDiscount!: HasManyAddAssociationMixin<BenchmarkDiscount, number>;
    public hasDiscount!: HasManyHasAssociationMixin<BenchmarkDiscount, number>;
    public countDiscounts!: HasManyCountAssociationsMixin;
    public createDiscount!: HasManyCreateAssociationMixin<BenchmarkDiscount>;
}

class BenchmarkDiscount extends Model {
    // Sequelize-managed fields
    public readonly id!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    // Custom fields
    public benchmarkTotalId!: number;
    public type!: string;
    public amount!: number;
}

class BenchmarkSurcharge extends Model {
    // Sequelize-managed fields
    public readonly id!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    // Custom fields
    public type!: string;
    public count!: number;
    public totalCharge!: number;
    public publishedCharge!: number;
    public targetDiscount!: number;
}

class FedexShippingMethod extends Model {
    // Sequelize-managed fields
    public readonly id!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    // Custom fields
    public displayName!: string;
    public serviceType!: string;
    public groundService!: string | null;
    public class!: string;
    public order!: number;

    // Relationships
    public getBuckets!: HasManyGetAssociationsMixin<FedexShippingMethodBucket>;
    public addBucket!: HasManyAddAssociationMixin<FedexShippingMethodBucket, number>;
    public hasBucket!: HasManyHasAssociationMixin<FedexShippingMethodBucket, number>;
    public countBuckets!: HasManyCountAssociationsMixin;
    public createBucket!: HasManyCreateAssociationMixin<FedexShippingMethodBucket>;
}

class FedexShippingMethodBucket extends Model {
    // Sequelize-managed fields
    public readonly id!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    // Custom fields
    public fedexShippingMethodId!: number;
    public displayName!: string;
    public minimum!: number | null;
    public maximum!: number | null;
}

class FedexSurcharge extends Model {
    // Sequelize-managed fields
    public readonly id!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    // Custom fields
    public type!: string;
    public charge!: number | null;
}

// Initialization 

User.init({
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    googleId: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    tableName: 'users',
    sequelize,
});

Customer.init({
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    tableName: 'customers',
    sequelize,
});

InvoiceUpload.init({
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    customerId: DataTypes.BIGINT.UNSIGNED,
    file: DataTypes.STRING,
}, {
    tableName: 'invoice_uploads',
    sequelize,
});

CustomerDiscount.init({
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    customerId: DataTypes.BIGINT.UNSIGNED,
    method: DataTypes.STRING,
    bucket: DataTypes.STRING,
    discount: DataTypes.FLOAT,
}, {
    tableName: 'customer_discounts',
    sequelize,
});

CustomerSurchargeDiscount.init({
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    customerId: DataTypes.BIGINT.UNSIGNED,
    type: DataTypes.STRING,
    actual: DataTypes.FLOAT,
    projected: DataTypes.FLOAT,
}, {
    tableName: 'customer_surcharge_discounts',
    sequelize,
});

Shipment.init({
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    customerId: DataTypes.BIGINT.UNSIGNED,
    carrier: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    carrierMetadata: DataTypes.JSON,
    trackingNumber: DataTypes.STRING,
    shipmentDate: DataTypes.DATE,
    invoiceDate: DataTypes.DATE,
    transportationCharge: DataTypes.FLOAT,
    weight: DataTypes.FLOAT,
}, {
    tableName: 'shipments',
    sequelize,
});

ShipmentDiscount.init({
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    shipmentId: DataTypes.BIGINT.UNSIGNED,
    type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
}, {
    tableName: 'shipment_discounts',
    sequelize,
});

ShipmentSurcharge.init({
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    shipmentId: DataTypes.BIGINT.UNSIGNED,
    type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
}, {
    tableName: 'shipment_surcharges',
    sequelize,
});

Benchmark.init({
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    customerId: DataTypes.BIGINT.UNSIGNED,
    file: DataTypes.STRING,
    annualizationFactor: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
    },
}, {
    tableName: 'benchmarks',
    sequelize,
});

BenchmarkTotal.init({
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    benchmarkId: DataTypes.BIGINT.UNSIGNED,
    order: DataTypes.BIGINT.UNSIGNED,
    bucketOrder: DataTypes.BIGINT.UNSIGNED,
    method: DataTypes.STRING,
    bucket: DataTypes.STRING,
    class: DataTypes.STRING,
    count: {
        type: DataTypes.INTEGER.UNSIGNED,
        defaultValue: 0,
    },
    transportationCharge: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
    },
    targetDiscount: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
    },
}, {
    tableName: 'benchmark_totals',
    sequelize,
});

BenchmarkDiscount.init({
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    benchmarkTotalId: DataTypes.BIGINT.UNSIGNED,
    type: DataTypes.STRING,
    amount: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
    },
}, {
    tableName: 'benchmark_discounts',
    sequelize,
});

BenchmarkSurcharge.init({
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    benchmarkId: DataTypes.BIGINT.UNSIGNED,
    type: DataTypes.STRING,
    count: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
    },
    totalCharge: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
    },
    publishedCharge: DataTypes.FLOAT,
    targetDiscount: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
    },
}, {
    tableName: 'benchmark_surcharges',
    sequelize,
});

FedexShippingMethod.init({
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    displayName: DataTypes.STRING,
    serviceType: DataTypes.STRING,
    groundService: DataTypes.STRING,
    class: DataTypes.STRING,
    order: DataTypes.BIGINT.UNSIGNED,
}, {
    tableName: 'fedex_shipping_methods',
    sequelize,
});

FedexShippingMethodBucket.init({
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    fedexShippingMethodId: DataTypes.BIGINT.UNSIGNED,
    displayName: DataTypes.STRING,
    minimum: DataTypes.FLOAT,
    maximum: DataTypes.FLOAT,
}, {
    tableName: 'fedex_shipping_method_buckets',
    sequelize,
});

FedexSurcharge.init({
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    charge: DataTypes.FLOAT,
}, {
    tableName: 'fedex_surcharges',
    sequelize,
});

Customer.hasMany(Shipment, {
    sourceKey: 'id',
    foreignKey: 'customerId',
    as: 'shipments'
});

Shipment.belongsTo(Customer, { targetKey: 'id' });

Customer.hasMany(InvoiceUpload, {
    sourceKey: 'id',
    foreignKey: 'customerId',
    as: 'invoice_uploads'
});

InvoiceUpload.belongsTo(Customer, { targetKey: 'id' });

Customer.hasMany(CustomerDiscount, {
    sourceKey: 'id',
    foreignKey: 'customerId',
    as: 'customer_discounts'
});

CustomerDiscount.belongsTo(Customer, { targetKey: 'id' });

Customer.hasMany(CustomerSurchargeDiscount, {
    sourceKey: 'id',
    foreignKey: 'customerId',
    as: 'customer_surcharge_discounts'
});

CustomerSurchargeDiscount.belongsTo(Customer, { targetKey: 'id' });

Shipment.hasMany(ShipmentDiscount, {
    sourceKey: 'id',
    foreignKey: 'shipmentId',
    as: 'discounts'
});

ShipmentDiscount.belongsTo(Shipment, { targetKey: 'id' });

Shipment.hasMany(ShipmentSurcharge, {
    sourceKey: 'id',
    foreignKey: 'shipmentId',
    as: 'surcharges'
});

ShipmentSurcharge.belongsTo(Shipment, { targetKey: 'id' });

Customer.hasMany(Benchmark, {
    sourceKey: 'id',
    foreignKey: 'customerId',
    as: 'benchmarks'
});

Benchmark.belongsTo(Customer, { targetKey: 'id' });

Benchmark.hasMany(BenchmarkTotal, {
    sourceKey: 'id',
    foreignKey: 'benchmarkId',
    as: 'totals'
});

BenchmarkTotal.belongsTo(Benchmark, { targetKey: 'id' });

Benchmark.hasMany(BenchmarkSurcharge, {
    sourceKey: 'id',
    foreignKey: 'benchmarkId',
    as: 'surcharges'
});

BenchmarkSurcharge.belongsTo(Benchmark, { targetKey: 'id' });

BenchmarkTotal.hasMany(BenchmarkDiscount, {
    sourceKey: 'id',
    foreignKey: 'benchmarkTotalId',
    as: 'discounts'
});

BenchmarkDiscount.belongsTo(BenchmarkTotal, { targetKey: 'id' });

FedexShippingMethod.hasMany(FedexShippingMethodBucket, {
    sourceKey: 'id',
    foreignKey: 'fedexShippingMethodId',
    as: 'buckets'
});

FedexShippingMethodBucket.belongsTo(FedexShippingMethod, { targetKey: 'id' });

export {
    User,
    Customer,
    InvoiceUpload,
    CustomerDiscount,
    CustomerSurchargeDiscount,
    Shipment,
    ShipmentDiscount,
    ShipmentSurcharge,
    Benchmark,
    BenchmarkTotal,
    BenchmarkDiscount,
    BenchmarkSurcharge,
    FedexShippingMethod,
    FedexShippingMethodBucket,
    FedexSurcharge,
}

export { Carrier };

export default sequelize;
