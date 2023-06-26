'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('reservation_user_seats', {
      id: {
        type: Sequelize.STRING(500),
        allowNull: false,
        unique: true,
        primaryKey: true,
      },
      reservationUserId: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      seatId: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
    });
  },

  async down(queryInterface) {
    return queryInterface.dropTable('reservation_user_seats');
  },
};
