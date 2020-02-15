import {Sequelize, Model, DataTypes, BuildOptions} from "sequelize";

 const database = new Sequelize(process.env.CONNECTION_STRING || '');

 export default database;