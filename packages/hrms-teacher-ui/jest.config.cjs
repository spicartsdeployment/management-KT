module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  moduleNameMapper: {
    '\\.(css|scss|sass)$': 'identity-obj-proxy',
    '^@school-hrms/common-components/(.+)$': '<rootDir>/../hrms-common-components/src/$1',
    '^@school-hrms/utility$': '<rootDir>/../hrms-utility/src/index.js',
    '^@school-hrms/utility/(.+)$': '<rootDir>/../hrms-utility/src/$1',
  },
  testMatch: ['**/__tests__/**/*.test.[jt]s?(x)', '**/?(*.)+(test).[jt]s?(x)'],
};
