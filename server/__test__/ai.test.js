const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../models');
const { truncateDatabase, generateToken, createTestUser, createTestTrip, createTestActivity } = require('./helpers/testHelper');
const geminiService = require('../services/gemini');
const mapsService = require('../services/maps');

// Mock the services
jest.mock('../services/gemini');
jest.mock('../services/maps');

let user, token, trip;

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

beforeEach(async () => {
  user = await createTestUser();
  token = generateToken({ id: user.id, email: user.email });
  trip = await createTestTrip(user.id);
  jest.clearAllMocks();
});

afterEach(async () => {
  await truncateDatabase();
});

afterAll(async () => {
  await sequelize.close();
});

describe('POST /api/ai/generate-itinerary', () => {
  test('should generate itinerary successfully', async () => {
    const mockItinerary = {
      days: [
        { day: 1, activities: ['Activity 1', 'Activity 2'] }
      ]
    };

    geminiService.generateItinerary.mockResolvedValue(mockItinerary);

    const response = await request(app)
      .post('/api/ai/generate-itinerary')
      .set('Authorization', `Bearer ${token}`)
      .send({
        destination: 'Bali',
        departureLocation: 'Jakarta',
        startDate: '2025-12-01',
        endDate: '2025-12-05',
        budget: 10000000,
        preferences: 'Beach and culture'
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Itinerary generated successfully');
    expect(response.body.data).toEqual(mockItinerary);
    expect(geminiService.generateItinerary).toHaveBeenCalledWith(
      'Bali',
      'Jakarta',
      '2025-12-01',
      '2025-12-05',
      10000000,
      'Beach and culture'
    );
  });

  test('should fail with invalid date range', async () => {
    const response = await request(app)
      .post('/api/ai/generate-itinerary')
      .set('Authorization', `Bearer ${token}`)
      .send({
        destination: 'Bali',
        departureLocation: 'Jakarta',
        startDate: '2025-12-05',
        endDate: '2025-12-01',
        budget: 10000000
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'End date must be after start date');
  });

  test('should fail without authentication', async () => {
    const response = await request(app)
      .post('/api/ai/generate-itinerary')
      .send({
        destination: 'Bali',
        startDate: '2025-12-01',
        endDate: '2025-12-05'
      });

    expect(response.status).toBe(401);
  });
});

describe('POST /api/ai/trips/:tripId/optimize-route', () => {
  test('should optimize route successfully', async () => {
    await createTestActivity(trip.id);

    const mockOptimizedData = {
      optimizedRoute: ['Location 1', 'Location 2']
    };

    geminiService.optimizeRoute.mockResolvedValue(mockOptimizedData);

    const response = await request(app)
      .post(`/api/ai/optimize-route/${trip.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Route optimized successfully');
    expect(response.body.data).toEqual(mockOptimizedData);
  });

  test('should fail when trip not found', async () => {
    const response = await request(app)
      .post('/api/ai/optimize-route/00000000-0000-0000-0000-000000000000')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
  });

  test('should fail when trip has no activities', async () => {
    const response = await request(app)
      .post(`/api/ai/optimize-route/${trip.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'No activities to optimize');
  });

  test('should fail without authentication', async () => {
    const response = await request(app)
      .post(`/api/ai/optimize-route/${trip.id}`);

    expect(response.status).toBe(401);
  });
});

describe('POST /api/ai/suggestions', () => {
  test('should get suggestions successfully', async () => {
    const mockSuggestion = {
      suggestions: ['Suggestion 1', 'Suggestion 2']
    };

    geminiService.getSuggestions.mockResolvedValue(mockSuggestion);

    const response = await request(app)
      .post('/api/ai/suggestions')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: 'What to do in Bali?'
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Suggestions retrieved successfully');
    expect(response.body.data).toEqual(mockSuggestion);
  });

  test('should fail when query is missing', async () => {
    const response = await request(app)
      .post('/api/ai/suggestions')
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Query is required');
  });

  test('should fail without authentication', async () => {
    const response = await request(app)
      .post('/api/ai/suggestions')
      .send({
        query: 'What to do in Bali?'
      });

    expect(response.status).toBe(401);
  });
});

describe('GET /api/ai/activity-suggestions/:tripId', () => {
  test('should get activity suggestions successfully', async () => {
    const mockSuggestions = {
      suggestions: ['Activity 1', 'Activity 2']
    };

    geminiService.generateActivitySuggestions.mockResolvedValue(mockSuggestions);

    const response = await request(app)
      .get(`/api/ai/activity-suggestions/${trip.id}?day=1`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Activity suggestions generated successfully');
    expect(response.body.data).toEqual(mockSuggestions);
  });

  test('should fail when trip not found', async () => {
    const response = await request(app)
      .get('/api/ai/activity-suggestions/00000000-0000-0000-0000-000000000000')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
  });

  test('should fail without authentication', async () => {
    const response = await request(app)
      .get(`/api/ai/activity-suggestions/${trip.id}`);

    expect(response.status).toBe(401);
  });
});

describe('GET /api/ai/analyze-budget/:tripId', () => {
  test('should analyze budget successfully', async () => {
    await createTestActivity(trip.id);

    const mockAnalysis = {
      totalCost: 100000,
      breakdown: { food: 50000, transport: 50000 }
    };

    geminiService.analyzeTripBudget.mockResolvedValue(mockAnalysis);

    const response = await request(app)
      .get(`/api/ai/analyze-budget/${trip.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Budget analyzed successfully');
    expect(response.body.data).toEqual(mockAnalysis);
  });

  test('should fail when trip not found', async () => {
    const response = await request(app)
      .get('/api/ai/analyze-budget/00000000-0000-0000-0000-000000000000')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
  });

  test('should fail without authentication', async () => {
    const response = await request(app)
      .get(`/api/ai/analyze-budget/${trip.id}`);

    expect(response.status).toBe(401);
  });
});

describe('POST /api/ai/geocode', () => {
  test('should geocode location successfully', async () => {
    const mockLocation = {
      lat: -8.3405,
      lng: 115.0920,
      address: 'Ubud, Bali'
    };

    mapsService.geocode.mockResolvedValue(mockLocation);

    const response = await request(app)
      .post('/api/ai/geocode')
      .set('Authorization', `Bearer ${token}`)
      .send({
        address: 'Ubud, Bali'
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Location geocoded successfully');
    expect(response.body.data).toEqual(mockLocation);
  });

  test('should fail when address is missing', async () => {
    const response = await request(app)
      .post('/api/ai/geocode')
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Address is required');
  });

  test('should fail without authentication', async () => {
    const response = await request(app)
      .post('/api/ai/geocode')
      .send({
        address: 'Ubud, Bali'
      });

    expect(response.status).toBe(401);
  });
});

describe('POST /api/ai/distance', () => {
  test('should calculate distance successfully', async () => {
    const mockDistance = {
      distance: '25 km',
      duration: '45 mins'
    };

    mapsService.getDistance.mockResolvedValue(mockDistance);

    const response = await request(app)
      .post('/api/ai/distance')
      .set('Authorization', `Bearer ${token}`)
      .send({
        origin: 'Jakarta',
        destination: 'Bogor'
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Distance calculated successfully');
    expect(response.body.data).toEqual(mockDistance);
  });

  test('should fail when origin is missing', async () => {
    const response = await request(app)
      .post('/api/ai/distance')
      .set('Authorization', `Bearer ${token}`)
      .send({
        destination: 'Bogor'
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Origin and destination are required');
  });

  test('should fail when destination is missing', async () => {
    const response = await request(app)
      .post('/api/ai/distance')
      .set('Authorization', `Bearer ${token}`)
      .send({
        origin: 'Jakarta'
      });

    expect(response.status).toBe(400);
  });

  test('should fail without authentication', async () => {
    const response = await request(app)
      .post('/api/ai/distance')
      .send({
        origin: 'Jakarta',
        destination: 'Bogor'
      });

    expect(response.status).toBe(401);
  });
});

describe('POST /api/ai/search-places', () => {
  test('should search places successfully', async () => {
    const mockPlaces = [
      { name: 'Place 1', address: 'Address 1' },
      { name: 'Place 2', address: 'Address 2' }
    ];

    mapsService.searchPlaces.mockResolvedValue(mockPlaces);

    const response = await request(app)
      .post('/api/ai/search-places')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: 'restaurants',
        location: 'Ubud, Bali'
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Places found successfully');
    expect(response.body.data).toEqual(mockPlaces);
  });

  test('should fail when query is missing', async () => {
    const response = await request(app)
      .post('/api/ai/search-places')
      .set('Authorization', `Bearer ${token}`)
      .send({
        location: 'Ubud, Bali'
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Query and location are required');
  });

  test('should fail when location is missing', async () => {
    const response = await request(app)
      .post('/api/ai/search-places')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: 'restaurants'
      });

    expect(response.status).toBe(400);
  });

  test('should fail without authentication', async () => {
    const response = await request(app)
      .post('/api/ai/search-places')
      .send({
        query: 'restaurants',
        location: 'Ubud, Bali'
      });

    expect(response.status).toBe(401);
  });
});
