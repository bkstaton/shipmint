'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t =>
      Promise.all([
        queryInterface.createTable(
          'fedex_shipping_methods', {
            id: {
              type: Sequelize.BIGINT.UNSIGNED,
              primaryKey: true,
              autoIncrement: true,
              allowNull: false,
            },
            displayName: Sequelize.STRING(255),
            serviceType: Sequelize.STRING(255),
            groundService: Sequelize.STRING(255),
            createdAt: Sequelize.DATE,
            updatedAt: Sequelize.DATE,
          }, {
            transaction: t
          }
        ),
        queryInterface.createTable(
          'fedex_shipping_method_buckets', {
            id: {
              type: Sequelize.BIGINT.UNSIGNED,
              primaryKey: true,
              autoIncrement: true,
              allowNull: false,
            },
            fedexShippingMethodId: {
              type: Sequelize.BIGINT.UNSIGNED,
              references: {
                model: {
                  tableName: 'fedex_shipping_methods',
                },
                key: 'id'
              },
            },
            displayName: Sequelize.STRING(255),
            minimum: {
              type: Sequelize.FLOAT,
              allowNull: true,
            },
            maximum: {
              type: Sequelize.FLOAT,
              allowNull: true,
            },
            createdAt: Sequelize.DATE,
            updatedAt: Sequelize.DATE,
          }, {
            transaction: t
          }
        ),
      ])
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => Promise.all([
      queryInterface.dropTable('fedex_shipping_method_buckets', {
        transaction: t
      }),
      queryInterface.dropTable('fedex_shipping_methods', {
        transaction: t
      }),
    ]));
  }
};