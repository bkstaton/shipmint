'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t =>
      Promise.all([
        queryInterface.addColumn(
          'benchmark_totals',
          'bucketOrder',
          Sequelize.BIGINT.UNSIGNED,
        ),
      ])
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => 
      Promise.all([
        queryInterface.removeColumn(
          'benchmark_totals',
          'bucketOrder'
        ),
      ])
    );
  }
};
