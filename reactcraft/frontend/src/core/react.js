export const React = {
  _currentComponent: null,
  _rootComponent: null,
  _updateQueue: [],
  _states: new Map(),
  _components: new Map(),

  useState(initialState) {
    const component = this._currentComponent;
    if (!this._states.has(component)) {
      this._states.set(component, []);
    }
    const componentStates = this._states.get(component);
    const index = componentStates.length;

    if (componentStates[index] === undefined) {
      componentStates[index] = initialState;
    }

    const setState = (newState) => {
      if (typeof newState === 'function') {
        newState = newState(componentStates[index]);
      }

      if (newState === componentStates[index]) return;
      if (JSON.stringify(newState) === JSON.stringify(componentStates[index])) return;

      console.log(newState);
      componentStates[index] = newState;
      console.log("컴포넌트의 상태는 ", componentStates[index]);
      
      this._updateQueue.push(component);
      this._scheduleUpdate();
    };

    return [componentStates[index], setState];
  },

  createElement(type, props, ...children) {
    const element = {
        type,
        props: {
            ...props,
            children: children.flat(),
        },
    };

    return element;
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
    const props = this._components.get(component).props;
    const newElement = component(props);
    // TODO: 렌더링 구현 X
    // this._updateDOM(this._container, this._rootComponent);
  }
};