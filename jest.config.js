export default {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  testMatch: ['**/__tests__/**/*.test.js', '**/__tests__/**/*.test.jsx'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/main.jsx',
    '!src/setupTests.js',
  ],
  moduleFileExtensions: ['js', 'jsx', 'json'],
};
