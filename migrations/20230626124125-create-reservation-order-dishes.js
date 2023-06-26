'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('reservation_order_dishes', {
      id: {
        type: Sequelize.STRING(500),
        allowNull: false,
        unique: true,
        primaryKey: true,
      },
      reservationOrderId: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      reservationUserId: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      userId: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      dishId: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      count: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal(
          'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
        ),
      },
    });
  },

  async down(queryInterface) {
    return queryInterface.dropTable('reservation_order_dishes');
  },
};
