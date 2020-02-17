import {
  DataTypes,
  Model
} from 'sequelize';

import models from './index';

class Benchmark extends Model {
  // Sequelize-managed fields
  public readonly id!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Custom fields
  public method!: string;
  public bucket!: string;
  public count!: number;
  public transportationCharge!: number;
  public graceDiscount!: number;
  public discount!: number;
  public earnedDiscount!: number;
  public performancePricing!: number;
  public automationDiscount!: number;
  public annualizationFactor!: number;
};

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
  graceDiscount: {
    type: DataTypes.FLOAT
  },
  discount: {
    type: DataTypes.FLOAT
  },
  earnedDiscount: {
    type: DataTypes.FLOAT
  },
  performancePricing: {
    type: DataTypes.FLOAT
  },
  automationDiscount: {
    type: DataTypes.FLOAT
  },
  annualizationFactor: {
    type: DataTypes.FLOAT
  },
}, {
  tableName: 'benchmarks',
  sequelize: models,
});

export default Benchmark;
