const { Expense, Trip, Activity } = require('../models');
const { Op } = require('sequelize');

class ExpenseController {
  static async getExpenses(req, res, next) {
    try {
      const { tripId } = req.params;
      const { category, startDate, endDate } = req.query;

      const trip = await Trip.findOne({
        where: { id: tripId, userId: req.user.id }
      });

      if (!trip) throw { name: "NotFound", id: tripId }

      const where = { tripId };

      if (category) {
        where.category = category;
      }

      if (startDate && endDate) {
        where.date = {
          [Op.between]: [new Date(startDate), new Date(endDate)]
        };
      }

      const expenses = await Expense.findAll({
        where,
        include: [
          {
            model: Activity,
            as: 'activity',
            attributes: ['id', 'title', 'day']
          }
        ],
        order: [['date', 'DESC']]
      });

      const summary = {
        total: expenses.reduce((sum, exp) => sum + exp.amount, 0),
        byCategory: expenses.reduce((acc, exp) => {
          acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
          return acc;
        }, {}),
        count: expenses.length
      };

      return res.status(200).json({
        message: "Expenses retrieved successfully",
        data: { expenses, summary }
      })
    } catch (err) {
      next(err);
    }
  }

  static async getExpense(req, res, next) {
    try {
      const { id } = req.params;

      const expense = await Expense.findOne({
        where: { id },
        include: [
          {
            model: Trip,
            as: 'trip',
            where: { userId: req.user.id }
          },
          {
            model: Activity,
            as: 'activity'
          }
        ]
      });

      if (!expense) throw { name: "NotFound", id }

      return res.status(200).json({
        message: "Expense retrieved successfully",
        data: expense
      })
    } catch (err) {
      next(err);
    }
  }

  static async createExpense(req, res, next) {
    try {
      const { tripId } = req.params;
      const { activityId, amount, category, description, date } = req.body;

      const trip = await Trip.findOne({
        where: { id: tripId, userId: req.user.id }
      });

      if (!trip) throw { name: "NotFound", id: tripId }

      if (activityId) {
        const activity = await Activity.findOne({
          where: { id: activityId, tripId }
        });

        if (!activity) throw { name: "NotFound", id: activityId }
      }

      const expense = await Expense.create({
        tripId,
        activityId: activityId || null,
        amount,
        category,
        description,
        date: date || new Date()
      });

      return res.status(201).json({
        message: "Expense created successfully",
        data: expense
      })
    } catch (err) {
      next(err);
    }
  }

  static async updateExpense(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const expense = await Expense.findOne({
        where: { id },
        include: [
          {
            model: Trip,
            as: 'trip',
            where: { userId: req.user.id }
          }
        ]
      });

      if (!expense) throw { name: "NotFound", id }

      await expense.update(updateData);

      return res.status(200).json({
        message: "Expense updated successfully",
        data: expense
      });
    } catch (err) {
      next(err);
    }
  }

  static async deleteExpense(req, res, next) {
    try {
      const { id } = req.params;

      const expense = await Expense.findOne({
        where: { id },
        include: [
          {
            model: Trip,
            as: 'trip',
            where: { userId: req.user.id }
          }
        ]
      });

      if (!expense) throw { name: "NotFound", id }

      await expense.destroy();

      return res.status(200).json({
        message: "Expense deleted successfully"
      });
    } catch (err) {
      next(err);
    }
  }

  static async getExpenseStats(req, res, next) {
    try {
      const { tripId } = req.params;

      const trip = await Trip.findOne({
        where: { id: tripId, userId: req.user.id }
      });

      if (!trip) throw { name: "NotFound", id: tripId }

      const expenses = await Expense.findAll({
        where: { tripId }
      });

      const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

      const byCategory = expenses.reduce((acc, exp) => {
        acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
        return acc;
      }, {});

      const dailyExpenses = expenses.reduce((acc, exp) => {
        const date = exp.date.toISOString().split('T')[0];
        acc[date] = (acc[date] || 0) + exp.amount;
        return acc;
      }, {});

      const stats = {
        total,
        budget: trip.budget || 0,
        remaining: (trip.budget || 0) - total,
        percentageUsed: trip.budget ? (total / trip.budget * 100).toFixed(2) : 0,
        byCategory,
        dailyExpenses,
        count: expenses.length,
        averagePerDay: Object.keys(dailyExpenses).length > 0
          ? (total / Object.keys(dailyExpenses).length).toFixed(2)
          : 0
      };

      return res.status(200).json({
        message: "Expense statistics retrieved successfully",
        data: stats
      });
    } catch (err) {
      next(err);
    }
  }

  static async bulkCreateExpenses(req, res, next) {
    try {
      const { tripId } = req.params;
      const { expenses } = req.body;

      const trip = await Trip.findOne({
        where: { id: tripId, userId: req.user.id }
      });

      if (!trip) throw { name: "NotFound", id: tripId }

      const createdExpenses = await Expense.bulkCreate(
        expenses.map(expense => ({
          ...expense,
          tripId
        }))
      );

      return res.status(201).json({
        message: "Expenses created successfully",
        data: createdExpenses
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = ExpenseController