const { sequelize } = require('../../models');
const { signToken } = require('../../utils/jwt');

const truncateDatabase = async () => {
  const models = Object.keys(sequelize.models);

  for (const modelName of models) {
    await sequelize.models[modelName].destroy({
      where: {},
      force: true,
      cascade: true,
      truncate: true
    });
  }
};

const generateToken = (payload) => {
  return signToken(payload);
};

const createTestUser = async () => {
  const { User } = require('../../models');
  const user = await User.create({
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123'
  });
  return user;
};

const createTestTrip = async (userId) => {
  const { Trip } = require('../../models');
  const trip = await Trip.create({
    userId,
    title: 'Test Trip',
    destination: 'Bali',
    departureLocation: 'Jakarta',
    startDate: new Date('2025-12-01'),
    endDate: new Date('2025-12-05'),
    budget: 10000000,
    status: 'draft'
  });
  return trip;
};

const createTestActivity = async (tripId) => {
  const { Activity } = require('../../models');
  const activity = await Activity.create({
    tripId,
    day: 1,
    title: 'Visit Temple',
    description: 'Visit beautiful temple',
    location: 'Ubud',
    startTime: '09:00',
    endTime: '12:00',
    category: 'sightseeing',
    cost: 100000,
    order: 0
  });
  return activity;
};

const createTestExpense = async (tripId, activityId = null) => {
  const { Expense } = require('../../models');
  const expense = await Expense.create({
    tripId,
    activityId,
    amount: 50000,
    category: 'food',
    description: 'Lunch',
    date: new Date()
  });
  return expense;
};

module.exports = {
  truncateDatabase,
  generateToken,
  createTestUser,
  createTestTrip,
  createTestActivity,
  createTestExpense
};
