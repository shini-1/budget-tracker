const mongoose = require('mongoose');

// Connect to a test database before running tests
beforeAll(async () => {
  const mongoURI = process.env.TEST_MONGO_URI || 'mongodb://localhost:27017/budget-tracker-test';
  await mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// Clean up after tests
afterAll(async () => {
  await mongoose.connection.close();
});

// Clear database collections between tests
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});
