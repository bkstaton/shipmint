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
    public method!: string;
    public bucket!: string;
    public count!: number;
    public transportationCharge!: number;
    public annualizationFactor!: number;
};

class Discount extends Model {
    // Sequelize-managed fields
    public readonly id!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    // Custom fields
    public method!: string;
    public bucket!: string;
    public amount!: number;
}

// Initialization 

User.init({
    name: {
        type: DataTypes.STRING,
    },
    email: {
        type: DataTypes.STRING,
    },
    googleId: {
        type: DataTypes.STRING,
    },
}, {
    tableName: 'users',
    sequelize,
});

Customer.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    tableName: 'customers',
    sequelize,
});

Benchmark.init({
    method: {
        type: DataTypes.STRING,
        allowNull: false
    },
    bucket: {
        type: DataTypes.STRING,
        allowNull: false
    },
    count: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    transportationCharge: {
        type: DataTypes.FLOAT
    },
    annualizationFactor: {
        type: DataTypes.FLOAT
    },
}, {
    tableName: 'benchmarks',
    sequelize,
});

Discount.init({
    method: {
        type: DataTypes.STRING,
    },
    bucket: {
        type: DataTypes.STRING,
    },
    amount: {
        type: DataTypes.FLOAT,
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

export {
    User,
    Customer,
    Benchmark,
    Discount,
}

export default sequelize;
