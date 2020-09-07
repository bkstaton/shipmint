'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => Promise.all([
      queryInterface.createTable(
        'fedex_surcharges', {
          id: {
            type: Sequelize.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
          },
          type: Sequelize.STRING,
          charge: Sequelize.FLOAT,
          createdAt: Sequelize.DATE,
          updatedAt: Sequelize.DATE,
        }
      ),
      queryInterface.createTable(
        'customer_surcharge_discounts', {
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
          type: Sequelize.STRING,
          actual: Sequelize.FLOAT,
          projected: Sequelize.FLOAT,
          createdAt: Sequelize.DATE,
          updatedAt: Sequelize.DATE,
        }
      ),
    ]));
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => Promise.all([
      queryInterface.dropTable('surcharges', {
        transaction: t
      }),
      queryInterface.dropTable('customer_surcharge_discounts', {
        transaction: t
      }),
    ]));
  }
};
