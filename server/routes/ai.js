const express = require('express');
const aiController = require('../controllers/aiController');

const router = express.Router();

router.post('/generate-itinerary', aiController.generateItinerary);
router.post('/optimize-route/:tripId', aiController.optimizeRoute);
router.post('/suggestions', aiController.getSuggestions);
router.get('/activity-suggestions/:tripId', aiController.getActivitySuggestions);
router.get('/analyze-budget/:tripId', aiController.analyzeBudget);

router.post('/geocode', aiController.geocodeLocation);
router.post('/distance', aiController.getDistance);
router.post('/search-places', aiController.searchPlaces);

module.exports = router;