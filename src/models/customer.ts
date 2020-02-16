import {
  DataTypes,
  Model
} from 'sequelize';

import models from './index';

class Customer extends Model {
  // Sequelize-managed fields
  public readonly id!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Custom fields
  public name!: string;
};

Customer.init({
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
}, {
  tableName: 'customers',
  sequelize: models,
});

export default Customer;
