import { variable } from "../react.js";

export function createRealDOM(element) {
  if (element.type === 'TEXT_ELEMENT') {
    const textNode = document.createTextNode(element.props.value);
    element.ref = textNode;
    return textNode;
  }

  if (typeof element.type === 'function') {
    variable._currentComponent = element.type;
    const componentElement = element.type(element.props);
    return createRealDOM(componentElement);
  }

  const dom = document.createElement(element.type);
  element.ref = dom;

  Object.entries(element.props).forEach(([key, value]) => {
    if (key !== 'children') {
      if (key.startsWith('on') && typeof value === 'function') {
        const eventType = key.toLowerCase().substring(2);
        dom.addEventListener(eventType, value);
      } else {
        dom.setAttribute(key, value);
      }
    }
  });

  const children = element.props.children || [];
  children.forEach((child) => {
    dom.appendChild(createRealDOM(child));
  });

  return dom;
};