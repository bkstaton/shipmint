'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'customer_discounts', {
        id: {
          type: Sequelize.BIGINT.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        customerId: {
          type: Sequelize.BIGINT.UNSIGNED,
          references: {
            model: {
              tableName: 'customers',
            },
            key: 'id'
          },
        },
        method: Sequelize.STRING,
        bucket: Sequelize.STRING,
        discount: Sequelize.FLOAT,
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE,
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('customer_discounts');
  }
};
