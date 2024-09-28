// TODO: 추후 파일로 분리하기 -> 가상 돔/useState 구현한 뒤 분리
export const React = {
  _virtualDOM: null,
  _currentComponent: null,
  _rootComponent: null,
  _updateQueue: [],
  _states: new Map(),
  _stateIndex: new Map(),

  useState(initialState) {
    const component = this._currentComponent;
    
    if (!this._states.has(component)) {
      this._states.set(component, []);
      this._stateIndex.set(component, 0);
    }
    const componentStates = this._states.get(component);
    const index = this._stateIndex.get(component);

    if (componentStates[index] === undefined) {
      componentStates[index] = initialState;
    }

    const setState = (newState) => {
      if (typeof newState === 'function') {
        newState = newState(componentStates[index]);
      }

      if (newState === componentStates[index]) return;
      if (JSON.stringify(newState) === JSON.stringify(componentStates[index])) return;

      componentStates[index] = newState;
      
      this._updateQueue.push(component);
      this._scheduleUpdate();
    };

    this._stateIndex.set(component, index+1);
    return [componentStates[index], setState];
  },

  createElement(type, props, ...children) {
    return {
      type,
      key: props?.key || null,
      props: {
        ...props,
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

  _createVirtualDOM(element) {
    if (typeof element === 'string' || typeof element === 'number') {
      return { type: 'TEXT_ELEMENT', props: { value: element } };
    }

    if (typeof element.type === 'function') {
      this._currentComponent = element.type;
      const componentElement = element.type(element.props);
      return this._createVirtualDOM(componentElement);
    }

    return {
      type: element.type,
      props: {
        ...element.props,
        children: (element.props.children || []).map(this._createVirtualDOM.bind(this))
      }
    }
  },

  _createRealDOM(element) {
    if (element.type === 'TEXT_ELEMENT') {
      return document.createTextNode(element.props.value);
    }

    if (typeof element.type === 'function') {
      this._currentComponent = element.type;
      const componentElement = element.type(element.props);
      return this._createRealDOM(componentElement);
    }

    const dom = document.createElement(element.type);

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

  _diffVirtualDOM(prevDOM, currentDOM) {
    console.log(prevDOM);
    console.log(currentDOM);
    if (!prevDOM) {
      return { status: 'CREATE_DOM', currentDOM };
    }

    if (!currentDOM) {
      return { status: 'REMOVE_DOM' };
    }

    // 1. 타입 비교
    if (prevDOM.type !== currentDOM.type) {
      return { status: 'REPLACE_DOM', currentDOM };
    }

    if (prevDOM.type === 'TEXT_ELEMENT' && prevDOM.value !== currentDOM.value) {
      return { status: 'REPLACE_TEXT', currentDOM };
    }

    // 2. 키 비교

    // 3. 속성 비교
    const propsPatches = this._diffProps(prevDOM.props, currentDOM.props);

    // 4. 자식 비교
    const childrenPatches = this._diffChildren(prevDOM.children, currentDOM.children);
  },

  _diffProps(prevProps, currentProps) {
    let patches = [];

    // 이전에 없던 prop이 새로 생긴 경우
    Object.entries(currentProps).forEach(([key, value]) => {
      if (key !== 'children' && prevProps[key] !== value) {
        patches.push({ status: 'CREATE_PROP', key, value });
      }
    })

    // 이전에 있던 속성이 현재 없는 경우
    Object.entries(prevProps).forEach(([key, value]) => {
      if (key !== 'children' && !(key in currentProps)) {
        patches.push({ status: 'REMOVE_PROP', key });
      }
    })

    return patches;
  },

  _diffChildren() {

  },

  _updateComponent(component) {
    this._currentComponent = component;
    this._stateIndex.set(component, 0);
    const newVirtualDOM = this._createVirtualDOM(this._rootComponent);

    const patches = this._diffVirtualDOM(this._virtualDOM, newVirtualDOM);
  }
};