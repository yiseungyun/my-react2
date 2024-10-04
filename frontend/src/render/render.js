import { variable } from "../react.js";
import { createVirtualDOM } from "../reconciler/createVirtualDOM.js";
import { createRealDOM } from "./createRealDOM.js";

export function render(element, container) {
  variable._rootComponent = element;
  variable._container = container;
  variable._virtualDOM = createVirtualDOM(element);
  updateDOM(container, variable._virtualDOM);
};

function updateDOM(container, virtualDOM) {
  container.innerHTML = '';
  const dom = createRealDOM(virtualDOM);
  container.appendChild(dom);
};