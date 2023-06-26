'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('order_statuses', {
      id: {
        type: Sequelize.STRING(500),
        allowNull: false,
        unique: true,
        primaryKey: true,
      },
      statusId: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      orderId: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
    });
  },

  async down(queryInterface) {
    return queryInterface.dropTable('order_statuses');
  },
};
