'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryIterface.sequelize.transaction(t =>
      Promise.all([
        queryInterface.createTable(
          'users', {
            id: Sequelize.BIGINT.UNSIGNED,
            name: Sequelize.STRING(255),
            email: Sequelize.STRING(255),
            googleId: Sequelize.STRING(255),
            createdAt: Sequelize.DATE,
            updatedAt: Sequelize.DATE,
          }, {
            transaction: t
          }
        ),
        queryInterface.createTable(
          'customers', {
            id: Sequelize.BIGINT.UNSIGNED,
            name: Sequelize.STRING(255),
            createdAt: Sequelize.DATE,
            updatedAt: Sequelize.DATE,
          }, {
            transaction: t
          }
        ),
        queryInterface.createTable(
          'benchmarks', {
            id: Sequelize.BIGINT.UNSIGNED,
            customerId: {
              type: Sequelize.BIGINT.UNSIGNED,
              references: {
                model: {
                  tableName: 'customers',
                },
                key: 'id'
              },
            },
            file: Sequelize.STRING(255),
            count: Sequelize.INTEGER.UNSIGNED,
            transportationCharge: Sequelize.FLOAT,
            annualizationFactor: Sequelize.FLOAT,
            createdAt: Sequelize.DATE,
            updatedAt: Sequelize.DATE,
          }, {
            transaction: t
          }
        ),
        queryInterface.createTable(
          'discounts', {
            id: Sequelize.BIGINT.UNSIGNED,
            benchmarkId: {
              type: Sequelize.BIGINT.UNSIGNED,
              references: {
                model: {
                  tableName: 'benchmarks',
                },
                key: 'id'
              },
            },
            discountType: Sequelize.STRING(255),
            method: Sequelize.STRING(255),
            bucket: Sequelize.STRING(255),
            amount: Sequelize.FLOAT,
          }, {
            transaction: t
          }
        ),
      ])
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => Promise.all([
      queryInterface.dropTable('discounts', {
        transaction: t
      }),
      queryInterface.dropTable('benchmarks', {
        transaction: t
      }),
      queryInterface.dropTable('customers', {
        transaction: t
      }),
      queryInterface.dropTable('users', {
        transaction: t
      }),
    ]));
  }
};