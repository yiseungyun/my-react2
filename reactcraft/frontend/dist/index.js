import App from '../dist/components/App.js';
import { createElement } from '../src/utils/createElement.js';
import { render } from "./utils/render.js";
render(createElement(App, null), document.getElementById('app'));