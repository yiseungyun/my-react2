export function render(component, container) {
  if (typeof component === 'string') {
      container.appendChild(document.createTextNode(component));
      return;
  }

  const element = document.createElement(component.type);

  // props 설정
  Object.entries(component.props).forEach(([key, value]) => {
      if (key !== 'children') {
          element.setAttribute(key, value);
      }
  });

  // children 처리
  const children = component.props.children || [];
  children.forEach(child => render(child, element));

  container.appendChild(element);
}