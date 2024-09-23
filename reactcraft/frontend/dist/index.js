import App from "../dist/App.js";
import { createElement } from "../utils/createElement.js";
import { render } from "../utils/render.js";
render(createElement(App, null), document.getElementById('app'));