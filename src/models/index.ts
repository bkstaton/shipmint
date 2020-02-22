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
    public count!: number;
    public transportationCharge!: number;
    public annualizationFactor!: number;

    // Relationships
    public getDiscounts!: HasManyGetAssociationsMixin<Discount>;
    public addDiscount!: HasManyAddAssociationMixin<Discount, number>;
    public hasDiscount!: HasManyHasAssociationMixin<Discount, number>;
    public countDiscounts!: HasManyCountAssociationsMixin;
    public createDiscount!: HasManyCreateAssociationMixin<Discount>;

    public static associations: {
        discounts: Association<Benchmark, Discount>;
    };
};

class Discount extends Model {
    // Sequelize-managed fields
    public readonly id!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    // Custom fields
    public benchmarkId!: number;
    public method!: string;
    public bucket!: string;
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
    count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    transportationCharge: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
    },
    annualizationFactor: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
    },
}, {
    tableName: 'benchmarks',
    sequelize,
});

Discount.init({
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    benchmarkId: DataTypes.BIGINT.UNSIGNED,
    method: DataTypes.STRING,
    bucket: DataTypes.STRING,
    type: DataTypes.STRING,
    amount: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
    },
}, {
    tableName: 'discounts',
    sequelize,
});

Customer.hasMany(Benchmark, {
    sourceKey: 'id',
    foreignKey: 'customerId',
    as: 'benchmarks'
});

Benchmark.belongsTo(Customer, { targetKey: 'id' });

Benchmark.hasMany(Discount, {
    sourceKey: 'id',
    foreignKey: 'benchmarkId',
    as: 'discounts'
});

Discount.belongsTo(Benchmark, { targetKey: 'id' });

export {
    User,
    Customer,
    Benchmark,
    Discount,
}

export default sequelize;
