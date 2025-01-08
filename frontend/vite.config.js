import { defineConfig } from 'vite';
import * as babel from '@babel/core';
import path from 'path';

function customJSX() {
  return {
    name: 'transform-jsx',
    enforce: 'pre',
    async transform(code, id) {
      if (!id.endsWith('.jsx') && !id.endsWith('.js')) return;

      const result = babel.transformSync(code, {
        plugins: [
          ['@babel/plugin-transform-react-jsx', {
            runtime: 'automatic',
            importSource: path.resolve(__dirname, './react/packages')
          }]
        ],
        filename: id
      });

      return {
        code: result.code,
        map: result.map
      };
    }
  };
}

export default defineConfig({
  plugins: [customJSX()],
  resolve: {
    alias: {
      '/react/packages/jsx-runtime': path.resolve(__dirname, './react/jsx-runtime.js')
    }
  }
});