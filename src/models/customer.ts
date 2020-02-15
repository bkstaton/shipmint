import { Sequelize, DataTypes } from 'sequelize';

const sequelize = new Sequelize('sqlite::memory:');

const Customer = sequelize.define('Customer', {
    // Model attributes are defined here
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }
  
  , {
 
  });
  
  // `sequelize.define` also returns the model
  console.log(Customer === sequelize.models.Customer); // true