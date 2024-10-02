// TODO: 추후 파일로 분리하기 -> 가상 돔/useState 구현한 뒤 분리
export const React = {
  _virtualDOM: null,
  _currentComponent: null,
  _rootComponent: null,
  _container: null,
  _updateQueue: [],
  _states: [],
  _stateKey: 0,
  
  useState(initialState) {
    const component = this._currentComponent;

    if (this._states.length === this._stateKey) {
      this._states.push(initialState);
    }

    const currentIndex = this._stateKey;
    const state = this._states[this._stateKey];

    const setState = (newState) => {
      if (typeof newState === 'function') {
        newState = newState(this._states[currentIndex]);
      }

      if (newState === this._states[currentIndex]) return;
      if (JSON.stringify(newState) === JSON.stringify(this._states[currentIndex])) return;

      this._states[currentIndex] = newState;
      
      this._updateQueue.push(component);
      this._scheduleUpdate();
    };

    this._stateKey += 1;
    return [state, setState];
  },

  createElement(type, props, ...children) {
    const { key, ...restProps } = props || {};
    return {
      type,
      key: key,
      props: {
        ...restProps,
        children: children.flat()
      }
    };
  },

  render(element, container) {
    this._rootComponent = element;
    this._container = container;
    this._virtualDOM = this._createVirtualDOM(element);
    this._updateDOM(container, this._virtualDOM);
  },

  _updateDOM(container, virtualDOM) {
    container.innerHTML = '';
    const dom = this._createRealDOM(virtualDOM);
    container.appendChild(dom);
  },

  _createVirtualDOM(element, prevVirtualDOM = null) {
    if (typeof element === 'string' || typeof element === 'number') {
      const virtualElement = { 
        type: 'TEXT_ELEMENT', 
        props: { value: element } 
      };

      if (prevVirtualDOM && prevVirtualDOM.type === 'TEXT_ELEMENT') {
        virtualElement.ref = prevVirtualDOM.ref;
      }

      return virtualElement;
    }

    if (typeof element.type === 'function') {
      this._currentComponent = element.type;
      const componentElement = element.type(element.props);
      return this._createVirtualDOM(componentElement, prevVirtualDOM);
    }

    const virtualElement = {
      type: element.type,
      props: {
        ...element.props,
        children: (element.props.children || []).map((child, index) => 
          this._createVirtualDOM(child, prevVirtualDOM ? prevVirtualDOM.props.children[index] : null)
        )
      }
    };

    if (prevVirtualDOM) {
      virtualElement.ref = prevVirtualDOM.ref;
    }

    return virtualElement;
  },

  _createRealDOM(element) {
    if (element.type === 'TEXT_ELEMENT') {
      const textNode = document.createTextNode(element.props.value);
      element.ref = textNode;
      return textNode;
    }

    if (typeof element.type === 'function') {
      this._currentComponent = element.type;
      const componentElement = element.type(element.props);
      return this._createRealDOM(componentElement);
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
      dom.appendChild(this._createRealDOM(child));
    });

    return dom;
  },

  _scheduleUpdate() {
    setTimeout(() => {
      while (this._updateQueue.length > 0) {
        const component = this._updateQueue.shift();
        this._updateComponent(component);
      }
    }, 0);
  },

  _updatePatchDOM(parentDOM, prevDOM, currentDOM) {
    if (!prevDOM) {
      parentDOM.appendChild(this._createRealDOM(currentDOM));
      return;
    }

    if (!currentDOM) {
      parentDOM.removeChild(prevDOM.ref);
      return;
    }

    if (prevDOM.type !== currentDOM.type) {
      parentDOM.replaceChild(this._createRealDOM(currentDOM), prevDOM.ref);
      return;
    }

    if (currentDOM.type === 'TEXT_ELEMENT') {
      if (prevDOM.props.value !== currentDOM.props.value) {
        prevDOM.ref.nodeValue = currentDOM.props.value;
      }
      return;
    }

    this._updateAttributes(prevDOM.ref, prevDOM.props, currentDOM.props);
    this._updateChildren(prevDOM.ref, prevDOM.props.children, currentDOM.props.children);
  },

  _updateAttributes(dom, prevProps, currentProps) {
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
  },

  _updateChildren(parentDOM, prevChildren, currentChildren) { 
    const maxLength = Math.max(prevChildren.length, currentChildren.length);
    for (let i = 0; i < maxLength; i++) {
      const prevChild = prevChildren[i];
      const currentChild = currentChildren[i];

      this._updatePatchDOM(parentDOM, prevChild, currentChild);
    }
  },

  _updateComponent(component) {
    this._currentComponent = component;
    this._stateKey = 0;
    const newVirtualDOM = this._createVirtualDOM(this._rootComponent, this._virtualDOM);

    //console.log(this._states);
    this._updatePatchDOM(this._container, this._virtualDOM, newVirtualDOM);

    this._virtualDOM = newVirtualDOM;
  },
};