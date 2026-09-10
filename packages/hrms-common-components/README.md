# HRMS Common Components

Shared UI components library for School HRMS micro-frontends.

## 📦 Components

### Card
Reusable card component with consistent styling and theming support.

```jsx
import { Card } from '@school-hrms/common-components';

<Card className="custom-class">
  <Card.Header>Title</Card.Header>
  <Card.Content>Content here</Card.Content>
</Card>
```

## 🚀 Usage

```bash
# Install in your micro-frontend
yarn add @school-hrms/common-components

# Import components
import { Card } from '@school-hrms/common-components';
```

## 🎨 Styling

All components support custom className and follow BEM naming conventions.

## 📝 Development

```bash
# Build
yarn build

# Watch mode
yarn watch

# Run tests
yarn test

# Lint
yarn lint
```

## 🔌 Peer Dependencies

- React 18.x
- React-DOM 18.x

## 📚 License

MIT
