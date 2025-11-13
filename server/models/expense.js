'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Expense extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Expense.belongsTo(models.Trip, { foreignKey: 'tripId', });
      Expense.belongsTo(models.Activity, { foreignKey: 'activityId', });
    }
  }
  Expense.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    tripId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    activityId: {
      type: DataTypes.UUID,
      allowNull: true
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 0
      }
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['accommodation', 'food', 'transportation', 'activities', 'shopping', 'other']]
      }
    },
    description: {
      type: DataTypes.STRING
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Expense',
  });
  return Expense;
};