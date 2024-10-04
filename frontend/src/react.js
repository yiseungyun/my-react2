import { useState } from "./hooks/useState.js";
import { createElement } from "./render/createElement.js";
import { render } from "./render/render.js";

export const variable = {
  _rootComponent: null,
  _container: null,
  _currentComponent: null,
  _virtualDOM: null,
  _stateKey: 0
}

export {
  useState,
  createElement,
  render
};