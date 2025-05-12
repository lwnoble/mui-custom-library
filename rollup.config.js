import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser'; // Updated import
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Get current directory (ES module equivalent of __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get all component directories in src/components
const componentsDir = path.join(__dirname, 'src/components');
const components = fs.readdirSync(componentsDir)
  .filter(dir => fs.statSync(path.join(componentsDir, dir)).isDirectory());

// Create an entry point for each component
const componentEntries = components.reduce((acc, component) => {
  const indexFile = path.join(componentsDir, component, `${component}.js`);
  if (fs.existsSync(indexFile)) {
    acc[component] = indexFile;
  }
  return acc;
}, {});

// Add the main entry point
const entries = {
  'index': path.join(__dirname, 'src/index.js'),
  ...componentEntries
};

export default {
  input: entries,
  output: [
    {
      dir: 'dist/cjs',
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
      preserveModules: true,
      preserveModulesRoot: 'src'
    },
    {
      dir: 'dist/esm',
      format: 'esm',
      sourcemap: true,
      exports: 'named',
      preserveModules: true,
      preserveModulesRoot: 'src'
    }
  ],
  plugins: [
    peerDepsExternal(),
    postcss({
      extensions: ['.css'],
      minimize: true,
      inject: {
        insertAt: 'top',
      },
    }),
    babel({
      exclude: 'node_modules/**',
      babelHelpers: 'bundled',
      extensions: ['.js', '.jsx'],  // Add .jsx extension support
    }),
    resolve(),
    commonjs(),
    terser()
  ],
  external: [
    'react', 
    'react-dom',
    'prop-types',
  ],
};