'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryString.createTable(
      'report_types',
      {
        id: {
          type: Sequelize.STRING,
          length: 255,
        }
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('report_types');
  }
};
