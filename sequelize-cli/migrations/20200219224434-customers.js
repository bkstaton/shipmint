'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'customers', {
        id: Sequelize.INTEGER,
        name: {
          type: Sequelize.STRING,
          length: 255,
        }
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('customers');
  }
};