'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Activities', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      tripId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Trips',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      day: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT
      },
      location: {
        type: Sequelize.JSONB
      },
      startTime: {
        type: Sequelize.STRING
      },
      endTime: {
        type: Sequelize.STRING
      },
      duration: {
        type: Sequelize.INTEGER
      },
      category: {
        type: Sequelize.STRING,
        allowNull: false
      },
      cost: {
        type: Sequelize.FLOAT
      },
      notes: {
        type: Sequelize.TEXT
      },
      order: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Activities');
  }
};