'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('table_reservation_invites', {
      id: {
        type: Sequelize.STRING(500),
        allowNull: false,
        unique: true,
        primaryKey: true,
      },
      reservationId: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      inviterId: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      friendId: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface) {
    return queryInterface.dropTable('table_reservation_invites');
  },
};
