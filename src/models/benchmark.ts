import { Sequelize, DataTypes } from 'sequelize';

const sequelize = new Sequelize('sqlite::memory:');

const Benchmark = sequelize.define('Benchmark', {
    // Model attributes are defined here
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }
  
  , {
 
  });
  
  // `sequelize.define` also returns the model
  console.log(Benchmark === sequelize.models.Benchmark); // true