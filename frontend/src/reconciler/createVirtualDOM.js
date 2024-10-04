import { variable } from "../react.js";

export function createVirtualDOM(element, prevVirtualDOM = null) {
  if (typeof element === 'string' || typeof element === 'number') {
    return { 
      type: 'TEXT_ELEMENT', 
      props: { value: element },
      ref: prevVirtualDOM?.ref
    };
  }

  if (typeof element.type === 'function') {
    variable._currentComponent = element.type;
    const componentElement = element.type(element.props);
    return createVirtualDOM(componentElement, prevVirtualDOM);
  }

  return {
    type: element.type,
    props: {
      ...element.props,
      children: (element.props.children || []).map((child, index) => 
        createVirtualDOM(child, prevVirtualDOM ? prevVirtualDOM.props.children[index] : null)
      )
    },
    ref: prevVirtualDOM?.ref
  };
};