// Force Jest to mock config/env.js for all imports
jest.mock('config/env', () => require('../../packages/hrms-school-ui/__mocks__/config/env.js'));
require('@testing-library/jest-dom');