import { createHostRootFiber } from "../src/react-reconciler/ReactFiber.js";
import { updateContainer } from "../src/react-reconciler/ReactFiberReconciler.js";
import { initializeUpdateQueue } from "../src/react-reconciler/ReactUpdateQueue.js";

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