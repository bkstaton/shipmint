'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => Promise.all([
      queryInterface.createTable(
        'invoice_uploads', {
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
          file: Sequelize.STRING,
          createdAt: Sequelize.DATE,
          updatedAt: Sequelize.DATE,
        }, {
          transaction: t
        }
      ),
      queryInterface.createTable(
        'projected_discounts', {
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
          carrier: Sequelize.STRING,
          carrierMetadata: Sequelize.JSON,
          discount: Sequelize.FLOAT,
          createdAt: Sequelize.DATE,
          updatedAt: Sequelize.DATE,
        }, {
          transaction: t
        }
      ),
      queryInterface.createTable(
        'shipments', {
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
          carrier: Sequelize.STRING,
          carrierMetadata: Sequelize.JSON,
          trackingNumber: Sequelize.STRING,
          shipmentDate: Sequelize.DATE,
          invoiceDate: Sequelize.DATE,
          transportationCharge: Sequelize.FLOAT,
          weight: Sequelize.FLOAT,
          createdAt: Sequelize.DATE,
          updatedAt: Sequelize.DATE,
        }, {
          transaction: t
        }
      ),
      queryInterface.createTable(
        'shipment_discounts', {
          id: {
            type: Sequelize.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
          },
          shipmentId: {
            type: Sequelize.BIGINT.UNSIGNED,
            references: {
              model: {
                tableName: 'shipments',
              },
              key: 'id'
            },
          },
          type: Sequelize.STRING,
          amount: Sequelize.FLOAT,
          createdAt: Sequelize.DATE,
          updatedAt: Sequelize.DATE,
        }, {
          transaction: t
        }
      ),
      queryInterface.createTable(
        'shipment_surcharges', {
          id: {
            type: Sequelize.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
          },
          shipmentId: {
            type: Sequelize.BIGINT.UNSIGNED,
            references: {
              model: {
                tableName: 'shipments',
              },
              key: 'id'
            },
          },
          type: Sequelize.STRING,
          amount: Sequelize.FLOAT,
          createdAt: Sequelize.DATE,
          updatedAt: Sequelize.DATE,
        }, {
          transaction: t
        }
      ),
    ]));
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