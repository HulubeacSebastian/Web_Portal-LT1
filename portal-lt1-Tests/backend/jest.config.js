const path = require('path');

const testsRoot = __dirname;
const monorepoRoot = path.join(testsRoot, '../..');
const backendRoot = path.join(monorepoRoot, 'portal-lt1-backend');

module.exports = {
  rootDir: backendRoot,
  roots: [testsRoot],
  testEnvironment: 'node',
  globalSetup: path.join(testsRoot, 'globalSetup.js'),
  globalTeardown: path.join(testsRoot, 'globalTeardown.js'),
  testTimeout: 30000,
  modulePaths: [path.join(backendRoot, 'node_modules')],
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.js', '!node_modules/**'],
  coveragePathIgnorePatterns: ['/node_modules/'],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
