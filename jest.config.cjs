module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapper: {
    // Aliases for project structure
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@components/(.*)$': '<rootDir>/packages/hrms-common-components/src/$1',
    '^@school-hrms/common-components(.*)$': '<rootDir>/packages/hrms-common-components/src$1',
    '^@assets/(.*)$': '<rootDir>/src/assets/$1',
    '^@utils/(.*)$': '<rootDir>/packages/hrms-utility/src/$1',
    '^@hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@services/(.*)$': '<rootDir>/src/services/$1',
    '\\.(css|scss|sass)$': 'identity-obj-proxy',
    // Mock config/env.js for Jest to avoid import.meta.env errors
    '^src/config/env$': '<rootDir>/packages/hrms-school-ui/__mocks__/config/env.js',
    '^config/env$': '<rootDir>/packages/hrms-school-ui/__mocks__/config/env.js',
    '^\.\./\.\./config/env$': '<rootDir>/packages/hrms-school-ui/__mocks__/config/env.js',
    '^\.\./config/env$': '<rootDir>/packages/hrms-school-ui/__mocks__/config/env.js',
    '^packages/hrms-school-ui/src/config/env$': '<rootDir>/packages/hrms-school-ui/__mocks__/config/env.js',
    '^/src/config/env$': '<rootDir>/packages/hrms-school-ui/__mocks__/config/env.js',
    '^/packages/hrms-school-ui/src/config/env$': '<rootDir>/packages/hrms-school-ui/__mocks__/config/env.js'
  },
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx}',
    '<rootDir>/src/**/*.{test,spec}.{js,jsx}',
    '<rootDir>/packages/hrms-school-ui/src/pages/meeting-scheduler/__tests__/**/*.{js,jsx}',
    '<rootDir>/packages/hrms-school-ui/__test__/**/*.{js,jsx}'
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/**/*.d.ts',
    '!src/index.js',
    '!src/setupTests.js'
  ],
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest'
  },
  // Transpile all workspace code, ignore only node_modules
  transformIgnorePatterns: ['/node_modules/'],
  transform: {
    '^.+\\.(js|jsx|cjs|mjs)$': 'babel-jest'
  },
};
