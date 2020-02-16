import {
  DataTypes,
  Model
} from 'sequelize';

import models from './index';

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
  sequelize: models,
  tableName: 'users',
});

export default User;
