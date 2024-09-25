import { createRealDOM, updateDOM } from "./virtualDOM.js";

export const reactDOM = {
  render: (element, container) => {
    if (!container._virtualDom) {
      container.appendChild(createRealDOM(element));
    } else {  
      updateDOM(container, element, container._virtualDom);
    }

    container._virtualDom = element;
  }
}