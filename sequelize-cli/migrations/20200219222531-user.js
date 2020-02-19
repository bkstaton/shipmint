'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'users', {
        id: Sequelize.INTEGER,
        name: {
          type: Sequelize.STRING,
          length: 255,
        },
        email: {
          type: Sequelize.STRING,
          length: 255,
        },
        googleId: {
          type: Sequelize.STRING,
          length: 255,
        },
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE,
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('users');
  }
};