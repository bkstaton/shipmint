'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t =>
      Promise.all([
        queryInterface.addColumn(
          'fedex_shipping_methods',
          'order',
          Sequelize.BIGINT.UNSIGNED,
        ),
        queryInterface.addColumn(
          'benchmark_totals',
          'order',
          Sequelize.BIGINT.UNSIGNED,
        ),
      ])
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => 
      Promise.all([
        queryInterface.removeColumn(
          'fedex_shipping_methods',
          'order'
        ),
        queryInterface.removeColumn(
          'benchmark_totals',
          'order'
        ),
      ])
    );
  }
};