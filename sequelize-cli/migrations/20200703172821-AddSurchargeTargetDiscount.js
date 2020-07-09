'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t =>
      Promise.all([
        queryInterface.addColumn(
          'benchmark_surcharges',
          'targetDiscount',
          Sequelize.FLOAT,
        ),
      ])
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => 
      Promise.all([
        queryInterface.removeColumn(
          'benchmark_surcharges',
          'targetDiscount'
        ),
      ])
    );
  }
};
