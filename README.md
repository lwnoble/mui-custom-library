# Custom React Component Library

A customizable React component library that generates CSS from JSON theme files using GitHub Actions.

## Features

- Custom React components that don't rely on MUI's default themes
- JSON-based theme configuration
- Automatic CSS generation from JSON using GitHub Actions
- Simple and extensible design

## Getting Started

### Installation

```bash
git clone https://github.com/yourusername/my-component-library.git
cd my-component-library
npm install
```

### Development

1. Modify components in the `src/components` directory
2. Update theme styles in `src/styles/theme.json`
3. Run `npm run generate-css` to update the CSS based on your JSON theme

### Building the Library

```bash
npm run build
```

### Using Components

```jsx
import { Button } from 'my-component-library';

function App() {
  return (
    <div>
      <Button variant="contained">Contained Button</Button>
      <Button variant="outlined">Outlined Button</Button>
      <Button variant="text">Text Button</Button>
      <Button variant="contained" color="secondary">Secondary Button</Button>
      <Button variant="contained" size="small">Small Button</Button>
      <Button variant="contained" size="large">Large Button</Button>
    </div>
  );
}
```

## Customizing the Theme

The theme is defined in `src/styles/theme.json`. Modify this file to customize component styles.

The theme structure:

```json
{
  "global": {
    "variables": { /* CSS variables */ },
    "styles": { /* Global styles */ }
  },
  "components": {
    "ComponentName": {
      "base": { /* Base styles */ },
      "variants": {
        "variantName": { /* Variant styles */ }
      }
    }
  }
}
```

When you push changes to the `theme.json` file, GitHub Actions will automatically generate the corresponding CSS.

## Adding New Components

1. Create a new folder in `src/components` for your component
2. Add the component's JavaScript file
3. Define styles for the component in `src/styles/theme.json`
4. Export the component in `src/index.js`

## License

MIT