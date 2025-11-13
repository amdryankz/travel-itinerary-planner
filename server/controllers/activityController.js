const { Activity, Trip } = require('../models');

class ActivityController {
  static async getActivities(req, res, next) {
    try {
      const { tripId } = req.params;

      const trip = await Trip.findOne({
        where: { id: tripId, userId: req.user.id }
      });

      if (!trip) throw { name: "NotFound", id: tripId }

      const activities = await Activity.findAll({
        where: { tripId },
        order: [['day', 'ASC'], ['order', 'ASC']]
      });

      return res.status(200).json({
        message: "Activities retrieved successfully",
        data: activities
      })
    } catch (err) {
      next(err)
    }
  }

  static async getActivity(req, res, next) {
    try {
      const { id } = req.params;

      const activity = await Activity.findOne({
        where: { id },
        include: [
          {
            model: Trip,
            as: 'trip',
            where: { userId: req.user.id }
          }
        ]
      });

      if (!activity) throw { name: "NotFound", id }

      return res.status(200).json({
        message: "Activity retrieved successfully",
        data: activity
      })
    } catch (err) {
      next(err)
    }
  }

  static async createActivity(req, res, next) {
    try {
      const { tripId } = req.params;
      const { day, title, description, location, startTime, endTime, duration, category, cost, notes, order } = req.body;

      const trip = await Trip.findOne({
        where: { id: tripId, userId: req.user.id }
      });

      if (!trip) throw { name: "NotFound", id: tripId }

      const activity = await Activity.create({
        tripId,
        day,
        title,
        description,
        location,
        startTime,
        endTime,
        duration,
        category,
        cost,
        notes,
        order: order || 0
      });

      return res.status(201).json({
        message: "Activity created successfully",
        data: activity
      })
    } catch (err) {
      next(err)
    }
  }

  static async updateActivity(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const activity = await Activity.findOne({
        where: { id },
        include: [
          {
            model: Trip,
            as: 'trip',
            where: { userId: req.user.id }
          }
        ]
      });

      if (!activity) throw { name: "NotFound", id }

      await activity.update(updateData);

      return res.status(200).json({
        message: "Activity updated successfully",
        data: activity
      });
    } catch (err) {
      next(err)
    }
  }

  static async deleteActivity(req, res, next) {
    try {
      const { id } = req.params;

      const activity = await Activity.findOne({
        where: { id },
        include: [
          {
            model: Trip,
            as: 'trip',
            where: { userId: req.user.id }
          }
        ]
      });

      if (!activity) throw { name: "NotFound", id }

      await activity.destroy();

      return res.status(200).json({
        message: "Activity deleted successfully",
      });
    } catch (err) {
      next(err)
    }
  }

  static async bulkCreateActivities(req, res, next) {
    try {
      const { tripId } = req.params;
      const { activities } = req.body;

      const trip = await Trip.findOne({
        where: { id: tripId, userId: req.user.id }
      });

      if (!trip) throw { name: "NotFound", id: tripId }

      const cleanedActivities = activities.map((activity, index) => {
        const cleaned = {
          tripId,
          day: activity.day || 1,
          title: activity.title || 'Untitled Activity',
          description: activity.description || null,
          location: activity.location || null,
          startTime: activity.startTime || null,
          endTime: activity.endTime || null,
          duration: activity.duration || null,
          category: activity.category || 'other',
          cost: activity.cost || 0,
          notes: activity.notes || null,
          order: activity.order !== undefined ? activity.order : index
        };

        const validCategories = ['sightseeing', 'food', 'transport', 'hotel', 'activity', 'shopping', 'other'];
        if (!validCategories.includes(cleaned.category)) {
          cleaned.category = 'other';
        }

        return cleaned;
      });

      const createdActivities = await Activity.bulkCreate(cleanedActivities);

      return res.status(201).json({
        message: "Activities created successfully",
        data: createdActivities
      })
    } catch (err) {
      next(err)
    }
  }

  static async reorderActivities(req, res, next) {
    try {
      const { tripId } = req.params;
      const { activities } = req.body;

      const trip = await Trip.findOne({
        where: { id: tripId, userId: req.user.id }
      });

      if (!trip) throw { name: "NotFound", id: tripId }

      await Promise.all(
        activities.map(({ id, order, day }) =>
          Activity.update(
            { order, day },
            { where: { id, tripId } }
          )
        )
      );

      const updatedActivities = await Activity.findAll({
        where: { tripId },
        order: [['day', 'ASC'], ['order', 'ASC']]
      });

      return res.status(200).json({
        message: "Activities reordered successfully",
        data: updatedActivities
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = ActivityController