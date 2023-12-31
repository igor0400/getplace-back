'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('payments', {
      id: {
        type: Sequelize.STRING(500),
        allowNull: false,
        unique: true,
        primaryKey: true,
      },
      shortId: {
        type: Sequelize.STRING(500),
        unique: true,
        allowNull: false,
      },
      initialAmount: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      discountProcent: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      discountAmount: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      totalAmount: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      currency: {
        type: Sequelize.STRING(50),
        allowNull: false,
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
    return queryInterface.dropTable('payments');
  },
};
