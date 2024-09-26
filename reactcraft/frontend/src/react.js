// TODO: 추후 파일로 분리하기 -> 전부 구현한 뒤 분리할 예정
export const React = {
  _currentComponent: null,
  _rootComponent: null,
  _updateQueue: [],
  _states: new Map(),
  _stateIndex: new Map(),
  _components: new Map(),

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

    this._stateIndex.set(component, index + 1);
    return [componentStates[index], setState];
  },

  createElement(type, props, ...children) {
    return {
      type,
      props: {
          ...props,
          children: children.flat(),
      }
    };
  },

  render(element, container) {
    this._rootComponent = element;
    this._container = container;
    this._updateDOM(container, element);
  },

  _updateDOM(container, element) {
    container.innerHTML = '';
    const dom = this._createRealDOM(element);
    container.appendChild(dom);
  },

  _createRealDOM(element) {
    if (typeof element === 'string' || typeof element === 'number') {
      return document.createTextNode(element);
    }

    if (typeof element.type === 'function') {
      this._currentComponent = element.type;
      if (!this._components.has(element.type)) {
        this._components.set(element.type, element);
      }
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

  _updateComponent(component) {
    this._currentComponent = component;
    this._stateIndex.set(component, 0);
    const newElement = component();
    console.log(newElement.parentNode);
    this._updateDOM(this._container, newElement);
    // 실제 DOM 추가 (가상 돔 도입 시 변경)
  }
};