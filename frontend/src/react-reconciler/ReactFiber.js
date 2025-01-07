import { HostRoot } from "../shared/ReactSymbol";

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

export { 
  createHostRootFiber,
  createFiber
}