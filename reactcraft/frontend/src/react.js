// TODO: 추후 파일로 분리하기 -> 가상 돔/useState 구현한 뒤 분리할 예정
export const React = {
  _virtualDOM: null,
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

    this._stateIndex.set(component, index+1);
    return [componentStates[index], setState];
  },

  createElement(type, props, ...children) {
    return {
      type,
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

  _diffVirtualDOM(prevDOM, currentDOM) {
    // TODO: 이전 돔과 현재 돔 비교 로직 작성
  },

  _updateComponent(component) {
    this._currentComponent = component;
    this._stateIndex.set(component, 0);
    const newVirtualDOM = this._createVirtualDOM(this._rootComponent);

    // 이전 가상돔과 현재 생성한 가상돔 비교 
    //const patches = this._diffVirtualDOM(this._virtualDOM, newVirtualDOM);
  }
};