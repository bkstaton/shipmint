import {
  DataTypes,
  Model
} from 'sequelize';

import models from './index';
import { Method, WeightBucket } from '../services/benchmark/types';

class Benchmark extends Model {
  // Sequelize-managed fields
  public readonly id!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Custom fields
  public method!: Method;
  public bucket!: WeightBucket;
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
}, {
  tableName: 'benchmarks',
  sequelize: models,
});

export default Benchmark;
