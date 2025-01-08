const REACT_ELEMENT_TYPE = Symbol.for('react.element');

function jsx(type, config, maybeKey) {
  let key = null;
  let ref = null;
  let props = {};
  
  if (maybeKey !== undefined) {
    key = '' + maybeKey;
  } else if (config && config.key !== undefined) {
    key = '' + config.key;
  }
  
  if (config && config.ref !== undefined) {
    ref = config.ref;
  }
  
  if (config !== null) {
    for (const propName in config) {
      if (
        propName !== 'key' &&
        propName !== 'ref' &&
        Object.prototype.hasOwnProperty.call(config, propName)
      ) {
        props[propName] = config[propName];
      }
    }
  }
  
  if (type && type.defaultProps) {
    const defaultProps = type.defaultProps;
    for (const propName in defaultProps) {
      if (props[propName] === undefined) {
        props[propName] = defaultProps[propName];
      }
    }
  }

  return {
    $$typeof: REACT_ELEMENT_TYPE,
    type,
    key,
    ref,
    props,
    _owner: null
  }
}

const jsxs = jsx;

export {
  jsx,
  jsxs
}