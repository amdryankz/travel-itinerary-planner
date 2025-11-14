# Setup Testing Environment

## Prerequisites

- PostgreSQL installed and running
- Node.js and npm installed
- Project dependencies installed (`npm install`)

## Step 1: Create Test Database

```bash
npx sequelize-cli db:create --env test
```

## Step 2: Configure Environment Variables

Make sure your `.env` file has the following variables:

```env
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME_DEV=travel_planner_development
DB_NAME_TEST=travel_planner_test
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
```

## Step 3: Run Migrations (Optional)

The tests will automatically sync the database schema, but you can also run migrations:

```bash
npx sequelize-cli db:migrate --env test
```

## Step 4: Run Tests

Run all tests:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Run specific test file:

```bash
npm test auth.test.js
```

## Troubleshooting

### Database Connection Error

If you get `database "travel_planner_test" does not exist`:

- Make sure you created the test database (Step 1)
- Check your database credentials in `.env`
- Ensure PostgreSQL is running

### Port Already in Use

If tests fail due to port conflicts:

- Stop any running instances of the server
- Check for processes using the same port

### Test Timeout

If tests timeout:

- Increase Jest timeout in `__test__/setup.js`
- Check database connection
- Ensure all async operations are properly awaited

### Coverage Threshold Not Met

If coverage is below 90%:

- Run tests with coverage report: `npm test -- --coverage`
- Check which files/lines are not covered
- Add more tests for uncovered scenarios

## Cleaning Up

### Drop Test Database

```bash
npx sequelize-cli db:drop --env test
```

### Clear Test Data

The tests automatically clean up data after each run, but if needed:

```bash
npx sequelize-cli db:migrate:undo:all --env test
npx sequelize-cli db:migrate --env test
```
