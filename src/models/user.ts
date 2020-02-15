import { Sequelize, DataTypes } from 'sequelize';

const sequelize = new Sequelize('sqlite::memory:');

const User = sequelize.define('User', {
    // Model attributes are defined here
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING
      // allowNull defaults to true
    },
    email: {
        type: DataTypes.STRING
    },
    googleId: {
        type: DataTypes.STRING
    }
  }
  
  , {
 
  });
  
  // `sequelize.define` also returns the model
  console.log(User === sequelize.models.User); // true