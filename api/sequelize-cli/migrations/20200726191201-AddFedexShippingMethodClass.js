'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t =>
      Promise.all([
        queryInterface.addColumn(
          'fedex_shipping_methods',
          'class',
          Sequelize.STRING,
        ),
        queryInterface.addColumn(
          'benchmark_totals',
          'class',
          Sequelize.STRING,
        ),
      ])
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => 
      Promise.all([
        queryInterface.removeColumn(
          'fedex_shipping_methods',
          'class'
        ),
        queryInterface.removeColumn(
          'benchmark_totals',
          'class'
        ),
      ])
    );
  }
};
