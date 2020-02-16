import {
    Sequelize
} from "sequelize";

const sequelize = new Sequelize(process.env.CONNECTION_STRING || '');

sequelize.authenticate();

export default sequelize;
