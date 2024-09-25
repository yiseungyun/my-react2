import { render } from './core/render.js';
import { createElement } from './core/createElement.js';
import App from './App.js';

const root = document.getElementById('root');
render(<App />, root);