# School UI Package

Real-time school bus tracking and transportation management module for School HRMS.

## 🚀 Features

- ✅ Real-time bus location tracking
- ✅ Driver and support staff information
- ✅ Route scheduling and stop management
- ✅ Daily performance metrics
- ✅ Safety alerts and emergency SOS
- ✅ Weekly analytics and reports

## 📦 Installation

```bash
yarn install
```

## 🛠️ Development

```bash
# Start development server
yarn start

# Watch mode for hot reload
yarn watch

# Run tests
yarn test

# Run tests in watch mode
yarn test:watch

# Generate coverage report
yarn test:coverage

# Lint code
yarn lint

# Fix linting issues
yarn lint:fix
```

## 🏗️ Build

```bash
# Production build
yarn build

# Development build
yarn build:dev

# Analyze bundle size
yarn analyze
```

## 📁 Structure

```
src/
├── pages/
│   └── bus-tracking/
│       ├── index.jsx              # Entry point
│       ├── BusTracking.jsx        # Presentation
│       ├── BusTracking_impl.jsx   # Logic hook
│       ├── BusTracking.scss       # Styles
│       ├── BusTracking.test.jsx   # Component tests
│       ├── BusTracking_impl.test.jsx  # Hook tests
│       ├── context.js             # State context
│       └── reducer.js             # State reducer
├── components/
├── services/
├── constants/
└── assets/
```

## ✅ Testing

All components have 80%+ test coverage with comprehensive unit and integration tests.

```bash
yarn test:coverage
```

## 🎨 Code Quality

- ESLint for code linting
- 80%+ test coverage
- < 10 cyclomatic complexity
- < 30 lines per function
- JSDoc comments for all public methods
- data-testid on all interactive elements

## 📝 License

MIT
