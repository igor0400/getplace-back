'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('free_tables', {
      id: {
        type: Sequelize.STRING(500),
        allowNull: false,
        unique: true,
        primaryKey: true,
      },
      placeId: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      tableId: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
    });
  },

  async down(queryInterface) {
    return queryInterface.dropTable('free_tables');
  },
};
