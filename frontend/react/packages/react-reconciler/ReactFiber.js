import { NoFlags, Placement } from "./ReactFiberFlag.js";
import { ClassComponent, FunctionComponent, HostComponent, HostRoot, HostText, TEXT_ELEMENT } from "./ReactWorkTag.js";

function createHostRootFiber() {
	return createFiber(HostRoot, null, null);
}

function createFiber(tag, pendingProps, key) {
	const props = pendingProps ?? {};
  const normalizedKey = key === null ? null : String(key);

	return {
		tag,
		key: normalizedKey,
		type: null,
		elementType: null,
		stateNode: null,
		return: null,
		child: null,
		sibling: null,
		index: 0,
		ref: null,
		pendingProps: {
      ...props,
      children: props.children || []
    },
		memoizedProps: null,
		updateQueue: null,
		memoizedState: null,
		flags: Placement,
		subtreeFlgs: NoFlags,
		deletions: null,
		alternate: null,
	};
}

function createFiberFromElement(element) {
	if (!element) return null;

	const { type, key, props } = element;
	let tag;

	if (!type) return null; 

  if (typeof type === 'function') {
    tag = type.prototype?.isReactComponent 
      ? ClassComponent
      : FunctionComponent;
  } else if (typeof type === 'string') {
    tag = HostComponent;
  } else if (type === TEXT_ELEMENT) {
    tag = HostText;
  }

	if (tag === undefined) return null;

	if (!props) {
		return createFiber(tag, {}, key);
	}

	const normalizedKey = key === null ? null : String(key);
	const children = props?.children || [];

  const fiber = createFiber(tag, {
		...props,
		children: Array.isArray(children) ? children : [children].filter(Boolean)
	}, normalizedKey);
  fiber.type = type;
  fiber.elementType = type;

  return fiber;
}

export { 
  createHostRootFiber,
  createFiber,
  createFiberFromElement
}