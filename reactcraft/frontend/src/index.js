import { createElement } from './core/createElement.js';
import App from './App.js';
import { reactDOM } from './core/react-dom.js';

const root = document.getElementById('root');
reactDOM.render(<App />, root);