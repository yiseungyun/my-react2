import { variable } from "../react.js";
import { createVirtualDOM } from "./createVirtualDOM.js";
import { updatePatchDOM } from "./updatePatchDOM.js";

export function updateComponent(component) {
  variable._currentComponent = component;
  variable._stateKey = 0;
  const newVirtualDOM = createVirtualDOM(variable._rootComponent, variable._virtualDOM);

  updatePatchDOM(variable._container, variable._virtualDOM, newVirtualDOM);

  variable._virtualDOM = newVirtualDOM;
};