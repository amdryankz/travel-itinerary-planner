const { Trip, Activity, Expense } = require('../models');
const { Op } = require('sequelize');

class TripController {
  static async getTrips(req, res, next) {
    try {
      const { status, search } = req.query;

      const where = { userId: req.user.id };

      if (status) {
        where.status = status;
      }

      if (search) {
        where[Op.or] = [
          { title: { [Op.iLike]: `%${search}%` } },
          { destination: { [Op.iLike]: `%${search}%` } }
        ];
      }

      const trips = await Trip.findAll({
        where,
        include: [
          {
            model: Activity,
            as: 'activities'
          }
        ],
        order: [['startDate', 'DESC']]
      });

      return res.status(200).json({
        message: "Trips retrieved successfully",
        data: trips
      })
    } catch (err) {
      next(err)
    }
  }

  static async getTrip(req, res, next) {
    try {
      const { id } = req.params;

      const trip = await Trip.findOne({
        where: { id, userId: req.user.id },
        include: [
          {
            model: Activity,
            as: 'activities'
          },
          {
            model: Expense,
            as: 'expenses'
          }
        ],
        order: [
          [{ model: Activity, as: 'activities' }, 'day', 'ASC'],
          [{ model: Activity, as: 'activities' }, 'order', 'ASC']
        ]
      });

      if (!trip) throw { name: "NotFound", id }

      return res.status(200).json({
        message: "Trips retrieved successfully",
        data: trip
      })
    } catch (err) {
      next(err)
    }
  }

  static async createTrip(req, res, next) {
    try {
      const { title, destination, departureLocation, startDate, endDate, budget, status, preferences, coverImage } = req.body;

      const trip = await Trip.create({
        userId: req.user.id,
        title,
        destination,
        departureLocation,
        startDate,
        endDate,
        budget,
        status: status || 'draft',
        preferences,
        coverImage
      });

      return res.status(201).json({
        message: "Trip created successfully",
        data: trip
      })
    } catch (error) {
      next(err)
    }
  }

  static async updateTrip(req, res, next) {
    try {
      const { id } = req.params;
      const { title, destination, departureLocation, startDate, endDate, budget, status, preferences, coverImage } = req.body;

      const trip = await Trip.findOne({
        where: { id, userId: req.user.id }
      });

      if (!trip) throw { name: "NotFound", id }

      await trip.update({
        title: title || trip.title,
        destination: destination || trip.destination,
        departureLocation: departureLocation || trip.departureLocation,
        startDate: startDate || trip.startDate,
        endDate: endDate || trip.endDate,
        budget: budget !== undefined ? budget : trip.budget,
        status: status || trip.status,
        preferences: preferences || trip.preferences,
        coverImage: coverImage || trip.coverImage
      });

      return res.status(200).json({
        message: "Trip updated successfully",
        data: trip
      })
    } catch (err) {
      next(err)
    }
  }

  static async deleteTrip(req, res, next) {
    try {
      const { id } = req.params;

      const trip = await Trip.findOne({
        where: { id, userId: req.user.id }
      });

      if (!trip) throw { name: "NotFound", id }

      await trip.destroy();

      return res.status(200).json({
        message: "Trip deleted successfully",
      });
    } catch (err) {
      next(err)
    }
  }

  static async getTripStats(req, res, next) {
    try {
      const trips = await Trip.findAll({
        where: { userId: req.user.id },
        include: [
          {
            model: Activity,
            as: 'activities'
          },
          {
            model: Expense,
            as: 'expenses'
          }
        ]
      });

      const stats = {
        totalTrips: trips.length,
        draftTrips: trips.filter(t => t.status === 'draft').length,
        confirmedTrips: trips.filter(t => t.status === 'confirmed').length,
        completedTrips: trips.filter(t => t.status === 'completed').length,
        totalBudget: trips.reduce((sum, t) => sum + (t.budget || 0), 0),
        totalActivities: trips.reduce((sum, t) => sum + t.activities.length, 0),
        totalExpenses: trips.reduce((sum, t) => sum + t.expenses.reduce((s, e) => s + e.amount, 0), 0)
      };

      return res.status(200).json({
        message: "Stats retrieved successfully",
        data: stats
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = TripController