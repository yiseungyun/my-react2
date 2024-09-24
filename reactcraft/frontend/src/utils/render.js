export const render = (element, container) => {
  if (typeof element === 'string' || typeof element === 'number') {
    container.appendChild(document.createTextNode(element));
    return;
  }

  const component = document.createElement(element.type);

  Object.entries(element.props).forEach(([key, value]) => {
    if (key !== 'children') {
      if (key.startsWith('on') && typeof value === 'function') {
        const eventType = key.toLowerCase().substring(2);
        component.addEventListener(eventType, value);
      } else {
        component.setAttribute(key, value);
      }
    }
  });

  const children = element.props.children || [];
  children.forEach((child) => render(child, component));

  container.appendChild(component);
};
