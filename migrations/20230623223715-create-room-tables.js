'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('room_tables', {
      id: {
        type: Sequelize.STRING(500),
        allowNull: false,
        unique: true,
        primaryKey: true,
      },
      roomId: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      number: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      positionX: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      positionY: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      state: {
        type: Sequelize.STRING(100),
        defaultValue: 'free',
      },
      price: {
        type: Sequelize.STRING(50),
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
    return queryInterface.dropTable('room_tables');
  },
};
