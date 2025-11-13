const geminiService = require('../services/gemini');
const mapsService = require('../services/maps');
const { Trip, Activity } = require('../models');

class AIController {
  static async generateItinerary(req, res, next) {
    try {
      const { destination, departureLocation, startDate, endDate, budget, preferences } = req.body;

      const start = new Date(startDate);
      const end = new Date(endDate);

      if (start >= end) throw { name: 'InvalidDateRange' };

      const itinerary = await geminiService.generateItinerary(
        destination,
        departureLocation,
        startDate,
        endDate,
        budget,
        preferences
      );

      return res.status(200).json({
        message: "Itinerary generated successfully",
        data: itinerary
      });
    } catch (err) {
      next(err)
    }
  }

  static async optimizeRoute(req, res, next) {
    try {
      const { tripId } = req.params;

      const trip = await Trip.findOne({
        where: { id: tripId, userId: req.user.id },
        include: [
          {
            model: Activity,
            as: 'activities'
          }
        ]
      });

      if (!trip) throw { name: "NotFound", id: tripId }

      if (!trip.activities || trip.activities.length === 0) {
        throw { name: "NoActivities", id: tripId }
      }

      const activitiesByDay = trip.activities.reduce((acc, activity) => {
        if (!acc[activity.day]) {
          acc[activity.day] = [];
        }
        acc[activity.day].push(activity);
        return acc;
      }, {});

      const optimizedData = await geminiService.optimizeRoute(activitiesByDay);

      return res.status(200).json({
        message: "Route optimized successfully",
        data: optimizedData
      });
    } catch (err) {
      next(err)
    }
  }

  static async getSuggestions(req, res, next) {
    try {
      const { query } = req.body;

      if (!query) throw { name: 'QueryBadRequest' };

      const suggestion = await geminiService.getSuggestions(query);

      return res.status(200).json({
        message: "Suggestions retrieved successfully",
        data: suggestion
      });
    } catch (err) {
      next(err)
    }
  }

  static async getActivitySuggestions(req, res, next) {
    try {
      const { tripId } = req.params;
      const { day } = req.query;

      const trip = await Trip.findOne({
        where: { id: tripId, userId: req.user.id },
        include: [
          {
            model: Activity,
            as: 'activities',
            where: { day: day || 1 },
            required: false
          }
        ]
      });

      if (!trip) throw { name: "NotFound", id: tripId }

      const suggestions = await geminiService.generateActivitySuggestions(
        trip.destination,
        day || 1,
        trip.activities || []
      );

      return res.status(200).json({
        message: "Activity suggestions generated successfully",
        data: suggestions
      });
    } catch (err) {
      next(err)
    }
  }

  static async analyzeBudget(req, res, next) {
    try {
      const { tripId } = req.params;

      const trip = await Trip.findOne({
        where: { id: tripId, userId: req.user.id },
        include: [
          {
            model: Activity,
            as: 'activities'
          }
        ]
      });

      if (!trip) throw { name: "NotFound", id: tripId }

      const analysis = await geminiService.analyzeTripBudget(
        trip.activities,
        trip.budget || 0
      );

      return res.status(200).json({
        message: "Budget analyzed successfully",
        data: analysis
      });
    } catch (err) {
      next(err)
    }
  }

  static async geocodeLocation(req, res, next) {
    try {
      const { address } = req.body;

      if (!address) throw { name: 'AddressBadRequest' };

      const location = await mapsService.geocode(address);


      return res.status(200).json({
        message: "Location geocoded successfully",
        data: location
      });
    } catch (err) {
      next(err)
    }
  }

  static async getDistance(req, res, next) {
    try {
      const { origin, destination } = req.body;

      if (!origin || !destination) {
        throw { name: 'PlaceBadRequest' };
      }

      const distance = await mapsService.getDistance(origin, destination);

      return res.status(200).json({
        message: "Distance calculated successfully",
        data: distance
      });
    } catch (err) {
      next(err)
    }
  }

  static async searchPlaces(req, res, next) {
    try {
      const { query, location } = req.body;

      if (!query || !location) {
        throw { name: 'QueryLocationBadRequest' };
      }

      const places = await mapsService.searchPlaces(query, location);

      return res.status(200).json({
        message: "Places found successfully",
        data: places
      });
    } catch (err) {
      next(err)
    }
  }
}

module.exports = AIController