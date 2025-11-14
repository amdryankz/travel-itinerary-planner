# Travel Planner API - Testing Documentation

## Overview

This directory contains comprehensive test suites for the Travel Planner API using Jest and Supertest with minimum 90% code coverage.

## Test Structure

```
__test__/
├── helpers/
│   └── testHelper.js          # Test utilities and helper functions
├── setup.js                   # Jest setup and configuration
├── auth.test.js              # Authentication tests
├── trip.test.js              # Trip management tests
├── activity.test.js          # Activity management tests
├── expense.test.js           # Expense tracking tests
├── ai.test.js                # AI features tests
├── authentication.test.js    # Authentication middleware tests
├── errorHandler.test.js      # Error handler middleware tests
└── jwt.test.js              # JWT utilities tests
```

## Running Tests

### Run all tests

```bash
npm test
```

### Run tests in watch mode

```bash
npm run test:watch
```

### Run tests with coverage

```bash
npm test -- --coverage
```

### Run specific test file

```bash
npm test auth.test.js
```

## Test Coverage Goals

- **Branches**: 90%
- **Functions**: 90%
- **Lines**: 90%
- **Statements**: 90%

## Test Suites

### 1. Authentication Tests (`auth.test.js`)

Tests for user authentication and registration:

- User registration with validation
- User login with credentials
- Google OAuth login
- Get current user information
- Token validation

### 2. Trip Tests (`trip.test.js`)

Tests for trip management:

- Create, read, update, delete trips
- Filter trips by status
- Search trips by title/destination
- Get trip statistics
- Authorization checks

### 3. Activity Tests (`activity.test.js`)

Tests for activity management:

- CRUD operations for activities
- Bulk create activities
- Reorder activities
- Activity validation
- Trip ownership verification

### 4. Expense Tests (`expense.test.js`)

Tests for expense tracking:

- CRUD operations for expenses
- Filter expenses by category and date
- Get expense statistics and summaries
- Bulk create expenses
- Budget analysis

### 5. AI Tests (`ai.test.js`)

Tests for AI-powered features:

- Generate trip itinerary
- Optimize route
- Get travel suggestions
- Activity suggestions
- Budget analysis
- Geocoding and distance calculation
- Places search

### 6. Middleware Tests

- **Authentication** (`authentication.test.js`): Token validation, user verification
- **Error Handler** (`errorHandler.test.js`): All error types and status codes

### 7. Utility Tests

- **JWT** (`jwt.test.js`): Token signing and verification

## Test Helpers

### `testHelper.js`

Provides utility functions for testing:

- `truncateDatabase()`: Clean all tables before/after tests
- `generateToken(payload)`: Generate JWT token for testing
- `createTestUser()`: Create a test user
- `createTestTrip(userId)`: Create a test trip
- `createTestActivity(tripId)`: Create a test activity
- `createTestExpense(tripId, activityId)`: Create a test expense

## Mocking

### External Services

The following services are mocked in tests:

- `geminiService`: AI-powered itinerary and suggestions
- `mapsService`: Google Maps API calls

Example:

```javascript
jest.mock("../services/gemini");
geminiService.generateItinerary.mockResolvedValue(mockData);
```

## Environment Variables

Test environment variables are configured in `.env.test`:

```
NODE_ENV=test
JWT_SECRET=test-secret-key-for-testing-purposes-only
GOOGLE_CLIENT_ID=test-google-client-id
```

## Database

Tests use an in-memory or separate test database. Database is:

- Synced before all tests
- Truncated after each test
- Closed after all tests complete

## Best Practices

1. **Isolation**: Each test is independent and doesn't affect others
2. **Setup/Teardown**: Use `beforeEach` and `afterEach` for test setup
3. **Clear Mocks**: Always clear mocks between tests
4. **Descriptive Names**: Test names clearly describe what they test
5. **Assertions**: Each test has clear, specific assertions
6. **Error Cases**: Both success and error cases are tested
7. **Authentication**: Tests verify both authenticated and unauthenticated access

## Common Test Patterns

### Testing Protected Routes

```javascript
test("should fail without authentication", async () => {
  const response = await request(app).get("/api/trips");

  expect(response.status).toBe(401);
});
```

### Testing with Authentication

```javascript
test("should get trips with valid token", async () => {
  const user = await createTestUser();
  const token = generateToken({ id: user.id, email: user.email });

  const response = await request(app)
    .get("/api/trips")
    .set("Authorization", `Bearer ${token}`);

  expect(response.status).toBe(200);
});
```

### Testing Error Cases

```javascript
test("should return 404 when trip not found", async () => {
  const response = await request(app)
    .get("/api/trips/00000000-0000-0000-0000-000000000000")
    .set("Authorization", `Bearer ${token}`);

  expect(response.status).toBe(404);
  expect(response.body).toHaveProperty("message");
});
```

## Troubleshooting

### Tests timing out

- Increase timeout: `jest.setTimeout(30000)`
- Check database connections are closed properly
- Ensure async operations are awaited

### Database errors

- Check database configuration for test environment
- Ensure migrations are up to date
- Verify test database is accessible

### Coverage not reaching 90%

- Check for untested edge cases
- Add tests for error scenarios
- Test all middleware and utilities
- Verify all route handlers are covered

## Contributing

When adding new features:

1. Write tests first (TDD approach)
2. Ensure tests cover success and error cases
3. Maintain minimum 90% coverage
4. Update this README if adding new test suites
5. Follow existing test patterns and conventions
