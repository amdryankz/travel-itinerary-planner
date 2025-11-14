const express = require('express');
const tripController = require('../controllers/tripController');

const router = express.Router();

router.get('/', tripController.getTrips);
router.get('/stats', tripController.getTripStats);
router.get('/:id', tripController.getTrip);
router.post('/', tripController.createTrip);
router.put('/:id', tripController.updateTrip);
router.delete('/:id', tripController.deleteTrip);

module.exports = router;