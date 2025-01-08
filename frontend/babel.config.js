export default {
  presets: [
    ['@babel/preset-react', {
      runtime: 'automatic', 
      importSource: './dist/react/package' 
    }]
  ]
};
