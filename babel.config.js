// babel.config.js
const config = {
    presets: [
      '@babel/preset-env',
      ['@babel/preset-react', { runtime: 'automatic' }]
    ]
  };
  
  // Support both ESM and CommonJS
  export default config;
  if (typeof module !== 'undefined') {
    module.exports = config;
  }