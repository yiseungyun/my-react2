import { createHostRootFiber } from "../react-reconciler/ReactFiber";
import { updateContainer } from "../react-reconciler/ReactFiberReconciler";
import { initializeUpdateQueue } from "../react-reconciler/ReactUpdateQueue";

function createRoot(container) {
  const root = {
		// 필수적인 속성
    containerInfo: container,   
    current: null,                
    finishedWork: null,         
    pendingChildren: null,    
    
    // 기본적인 상태 관리를 위한 속성
    pendingLanes: NoLanes,         
    finishedLanes: NoLanes,  
    callbackNode: null,           
    callbackPriority: NoLane,   
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