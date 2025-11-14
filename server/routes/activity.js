const express = require('express');
const activityController = require('../controllers/activityController');
const router = express.Router();

router.get('/trip/:tripId', activityController.getActivities);
router.get('/:id', activityController.getActivity);
router.post('/trip/:tripId', activityController.createActivity);
router.post('/trip/:tripId/bulk', activityController.bulkCreateActivities);
router.post('/trip/:tripId/reorder', activityController.reorderActivities);
router.put('/:id', activityController.updateActivity);
router.delete('/:id', activityController.deleteActivity);

module.exports = router;