'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('reservation_order_payment_users', {
      id: {
        type: Sequelize.STRING(500),
        allowNull: false,
        unique: true,
        primaryKey: true,
      },
      reservationOrderPaymentId: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      placeId: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      paymentId: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      userId: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
    });
  },

  async down(queryInterface) {
    return queryInterface.dropTable('reservation_order_payment_users');
  },
};
