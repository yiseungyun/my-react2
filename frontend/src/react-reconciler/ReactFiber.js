import { HostRoot } from "./ReactWorkTag";

function createHostRootFiber() {
	return createFiber(HostRoot, null, null);
}

function createFiber(tag, pendingProps, key) {
	return {
		tag,
		key,
		type: null,
		elementType: null,
		stateNode: null,
		return: null,
		child: null,
		sibling: null,
		index: 0,
		ref: null,
		pendingProps,
		memoizedProps: null,
		updateQueue: null,
		memoizedState: null,
		flags: 'Placement',
		subtreeFlgs: 'NoFlags',
		deletions: null,
		alternate: null,
	};
}

function createFiberFromElement(element) {
	const { type, key, props } = element;
	
	let tag;
  if (typeof type === 'function') {
    tag = type.prototype?.isReactComponent 
      ? ClassComponent 
      : FunctionComponent;
  } else if (typeof type === 'string') {
    tag = HostComponent;
  } else if (type === TEXT_ELEMENT) {
    tag = HostText;
  }

  const fiber = createFiber(tag, props, key);
  fiber.type = type;
  fiber.elementType = type;

  return fiber;
}

export { 
  createHostRootFiber,
  createFiber,
  createFiberFromElement
}