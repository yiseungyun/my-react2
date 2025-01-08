import { createHostRootFiber } from "../react-reconciler/ReactFiber.js";
import { updateContainer } from "../react-reconciler/ReactFiberReconciler.js";
import { initializeUpdateQueue } from "../react-reconciler/ReactUpdateQueue.js";

function createRoot(container) {
  const root = {
		// 필수적인 속성
    containerInfo: container,   
    current: null,                
    finishedWork: null,         
    pendingChildren: null
	}
	
	const rootFiber = createHostRootFiber();
	root.current = rootFiber;
	rootFiber.stateNode = root;
	
	// 업데이트 큐 초기화
	initializeUpdateQueue(rootFiber);
	
	return {
		render(element) {
			updateContainer(element, root);
		}
	}
}

export {
  createRoot
}