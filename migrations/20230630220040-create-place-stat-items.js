'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('place_stat_items', {
      id: {
        type: Sequelize.STRING(500),
        allowNull: false,
        unique: true,
        primaryKey: true,
      },
      placeStatId: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      dayCount: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      weekCount: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      monthCount: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      yearCount: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      allTimeCount: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      daysLastClearDate: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      weeksLastClearDate: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      monthsLastClearDate: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      yearsLastClearDate: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
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
    return queryInterface.dropTable('place_stat_items');
  },
};
