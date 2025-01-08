import { defineConfig } from 'vite';

export default defineConfig({
  esbuild: {
    jsxFactory: 'jsx',
    jsxFragment: 'Fragment',
    jsxInject: `import { jsx } from '/react/package/jsx-runtime.js'`
  },
  resolve: {
    alias: {
      'react': '/react/package',
      'react-dom/client': '/react/package/react-dom/client.js',
      'react/jsx-runtime': '/react/package/jsx-runtime.js'
    }
  }
});