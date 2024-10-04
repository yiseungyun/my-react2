export function createElement(type, props, ...children) {
  const { key, ...restProps } = props || {};
  return {
    type,
    key: key,
    props: {
      ...restProps,
      children: children.flat()
    }
  };
};