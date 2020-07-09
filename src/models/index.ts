import {
    Sequelize, Model, DataTypes, HasManyGetAssociationsMixin, HasManyAddAssociationMixin, HasManyHasAssociationMixin, HasManyCountAssociationsMixin, HasManyCreateAssociationMixin, Association, FLOAT
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

    public static associations: {
        benchmarks: Association<Customer, Benchmark>;
    };
};

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

    public static associations: {
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
    Benchmark,
    BenchmarkTotal,
    BenchmarkDiscount,
    BenchmarkSurcharge,
    FedexShippingMethod,
    FedexShippingMethodBucket,
}

export default sequelize;
