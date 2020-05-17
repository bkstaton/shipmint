'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t =>
      Promise.all([
        queryInterface.createTable(
          'benchmark_surcharges', {
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
            type: Sequelize.STRING(255),
            count: Sequelize.INTEGER.UNSIGNED,
            totalCharge: Sequelize.FLOAT.UNSIGNED,
            publishedCharge: Sequelize.FLOAT.UNSIGNED,
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
      queryInterface.dropTable('benchmark_surcharges', {
        transaction: t
      }),
    ]));
  }
};
