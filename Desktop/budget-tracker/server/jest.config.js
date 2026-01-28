module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.js', '**/?(*.)+(spec|test).js'],
  collectCoverageFrom: [
    'routes/**/*.js',
    'models/**/*.js',
    'middleware/**/*.js',
    '!**/__tests__/**'
  ],
  coveragePathIgnorePatterns: ['/node_modules/'],
  testTimeout: 10000
};
