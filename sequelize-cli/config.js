require('dotenv').config();

module.exports = {
    "development": {
        "url": process.env.CONNECTION_STRING,
    },
    "production": {
        "url": process.env.PROD_CONNECTION_STRING,
    }
};
