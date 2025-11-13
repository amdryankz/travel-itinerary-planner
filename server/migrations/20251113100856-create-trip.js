'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Trips', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      destination: {
        type: Sequelize.STRING,
        allowNull: false
      },
      departureLocation: {
        type: Sequelize.STRING,
        allowNull: true
      },
      departureCoordinates: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      startDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      endDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      budget: {
        type: Sequelize.FLOAT
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: 'draft'
      },
      preferences: {
        type: Sequelize.JSONB
      },
      coverImage: {
        type: Sequelize.STRING
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

    await queryInterface.addIndex('Trips', ['userId']);
    await queryInterface.addIndex('Trips', ['status']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Trips');
  }
};