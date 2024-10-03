// TODO: diff(변경된 부분 비교)/update(변경 사항 업데이트) 로직 분리

export function updatePatchDOM(parentDOM, prevDOM, currentDOM) {
  if (!prevDOM) {
    parentDOM.appendChild(createRealDOM(currentDOM));
    return;
  }

  if (!currentDOM) {
    parentDOM.removeChild(prevDOM.ref);
    return;
  }

  if (prevDOM.type !== currentDOM.type) {
    parentDOM.replaceChild(createRealDOM(currentDOM), prevDOM.ref);
    return;
  }

  if (currentDOM.type === 'TEXT_ELEMENT') {
    if (prevDOM.props.value !== currentDOM.props.value) {
      prevDOM.ref.nodeValue = currentDOM.props.value;
    }
    return;
  }

  updateAttributes(prevDOM.ref, prevDOM.props, currentDOM.props);
  updateChildren(prevDOM.ref, prevDOM.props.children, currentDOM.props.children);
};

function updateAttributes(dom, prevProps, currentProps) {
  Object.keys(prevProps).forEach(key => {
    if (key !== 'children' && key !== 'key' && !(key in currentProps)) {
      if (key.startsWith('on')) {
        const eventType = key.toLowerCase().substring(2);
        dom.removeEventListener(eventType, prevProps[key]);
      } else {
        dom.removeAttribute(key);
      }
    }
  });

  Object.keys(currentProps).forEach(key => {
    if (key !== 'children' && key !== 'key' && prevProps[key] !== currentProps[key]) {
      if (key.startsWith('on')) {
        const eventType = key.toLowerCase().substring(2);
        dom.addEventListener(eventType, currentProps[key]);
      } else {
        dom.setAttribute(key, currentProps[key]);
      }
    }
  });
};

function updateChildren(parentDOM, prevChildren, currentChildren) { 
  const maxLength = Math.max(prevChildren.length, currentChildren.length);
  for (let i = 0; i < maxLength; i++) {
    const prevChild = prevChildren[i];
    const currentChild = currentChildren[i];

    updatePatchDOM(parentDOM, prevChild, currentChild);
  }
};