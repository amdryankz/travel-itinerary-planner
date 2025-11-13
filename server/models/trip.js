'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Trip extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Trip.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
      Trip.hasMany(models.Activity, { foreignKey: 'tripId', as: 'activities' });
      Trip.hasMany(models.Expense, { foreignKey: 'tripId', as: 'expenses' });
    }
  }
  Trip.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    departureLocation: {
      type: DataTypes.STRING,
      allowNull: true
    },
    destination: {
      type: DataTypes.STRING,
      allowNull: false
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    budget: {
      type: DataTypes.FLOAT
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'draft',
      validate: {
        isIn: [['draft', 'confirmed', 'completed', 'cancelled']]
      }
    },
    preferences: {
      type: DataTypes.JSONB
    },
    coverImage: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'Trip',
  });
  return Trip;
};