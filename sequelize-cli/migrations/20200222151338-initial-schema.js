'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t =>
      Promise.all([
        queryInterface.createTable(
          'users', {
            id: {
              type: Sequelize.BIGINT.UNSIGNED,
              primaryKey: true,
              autoIncrement: true,
              allowNull: false,
            },
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
            id: {
              type: Sequelize.BIGINT.UNSIGNED,
              primaryKey: true,
              autoIncrement: true,
              allowNull: false,
            },
            name: Sequelize.STRING(255),
            createdAt: Sequelize.DATE,
            updatedAt: Sequelize.DATE,
          }, {
            transaction: t
          }
        ),
        queryInterface.createTable(
          'benchmarks', {
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
            file: Sequelize.STRING(255),
            annualizationFactor: Sequelize.FLOAT,
            createdAt: Sequelize.DATE,
            updatedAt: Sequelize.DATE,
          }, {
            transaction: t
          }
        ),
        queryInterface.createTable(
          'benchmark_totals', {
            id: {
              type: Sequelize.BIGINT.UNSIGNED,
              primaryKey: true,
              autoIncrement: true,
              allowNull: false,
            },
            benchmarkId: {
              type: Sequelize.BIGINT.UNSIGNED,
              references: {
                model: {
                  tableName: 'benchmarks',
                },
                key: 'id'
              },
            },
            method: Sequelize.STRING(255),
            bucket: Sequelize.STRING(255),
            count: Sequelize.INTEGER.UNSIGNED,
            transportationCharge: Sequelize.FLOAT,
            createdAt: Sequelize.DATE,
            updatedAt: Sequelize.DATE,
          }, {
            transaction: t,
          }
        ),
        queryInterface.createTable(
          'benchmark_discounts', {
            id: {
              type: Sequelize.BIGINT.UNSIGNED,
              primaryKey: true,
              autoIncrement: true,
              allowNull: false,
            },
            benchmarkTotalId: {
              type: Sequelize.BIGINT.UNSIGNED,
              references: {
                model: {
                  tableName: 'benchmark_totals',
                },
                key: 'id'
              },
            },
            type: Sequelize.STRING(255),
            amount: Sequelize.FLOAT,
            createdAt: Sequelize.DATE,
            updatedAt: Sequelize.DATE,
          }, {
            transaction: t,
          }
        ),
      ])
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => Promise.all([
      queryInterface.dropTable('benchmark_discounts', {
        transaction: t
      }),
      queryInterface.dropTable('benchmark_totals', {
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