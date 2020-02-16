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
};

Benchmark.init({
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
}, {
  tableName: 'benchmarks',
  sequelize: models,
});

export default Benchmark;
