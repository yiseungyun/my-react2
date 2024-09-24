import { render } from './utils/render.js';
import { createElement } from './utils/createElement.js';
import App from './App.js';

const root = document.getElementById('root');
render(<App />, root);