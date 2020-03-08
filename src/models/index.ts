import {
    Sequelize, Model, DataTypes, HasManyGetAssociationsMixin, HasManyAddAssociationMixin, HasManyHasAssociationMixin, HasManyCountAssociationsMixin, HasManyCreateAssociationMixin, Association
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

    // Relationships
    public getTotals!: HasManyGetAssociationsMixin<BenchmarkTotal>;
    public addTotal!: HasManyAddAssociationMixin<BenchmarkTotal, number>;
    public hasTotal!: HasManyHasAssociationMixin<BenchmarkTotal, number>;
    public countTotals!: HasManyCountAssociationsMixin;
    public createTotal!: HasManyCreateAssociationMixin<BenchmarkTotal>;

    public static associations: {
        totals: Association<Benchmark, BenchmarkTotal>;
        discounts: Association<Benchmark, BenchmarkDiscount>;
    };
}

class BenchmarkTotal extends Model {
    // Sequelize-managed fields
    public readonly id!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    // Custom fields
    public benchmarkId!: number;
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

BenchmarkTotal.hasMany(BenchmarkDiscount, {
    sourceKey: 'id',
    foreignKey: 'benchmarkTotalId',
    as: 'discounts'
});

BenchmarkDiscount.belongsTo(BenchmarkTotal, { targetKey: 'id' });

export {
    User,
    Customer,
    Benchmark,
    BenchmarkTotal,
    BenchmarkDiscount,
}

export default sequelize;
