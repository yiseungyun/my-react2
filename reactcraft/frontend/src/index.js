import { createElement } from './core/createElement.js';
import App from './App.js';
import { reactDOM } from './core/reactDOM.js';

const root = document.getElementById('root');
reactDOM.render(<App />, root);