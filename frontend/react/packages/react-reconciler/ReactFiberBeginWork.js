import { createFiberFromElement } from "./ReactFiber.js";
import { Placement, Update } from "./ReactFiberFlag.js";
import { ClassComponent, FunctionComponent, HostComponent, HostRoot, HostText, TEXT_ELEMENT } from "./ReactWorkTag.js";

function beginWork(current, workInProgress) {
	if (current !== null) { // 업데이트
		const oldProps = current.memoizedProps;
		const newProps = workInProgress.pendingProps;
		
		// 타입 변경 확인
		if (
			workInProgress.type === current.type &&
			oldProps === newProps
		) { // 자식 재사용
			workInProgress.child = current.child;
			return null;
		}
	}
	
	switch (workInProgress.tag) {
		case HostRoot: {
			const root = workInProgress.stateNode;
			const nextChildren = workInProgress.pendingProps.element;
			console.log('HostRoot nextChildren:', nextChildren);
			
			reconcileChildren(current, workInProgress, nextChildren);
			return workInProgress.child;
		}
		
		case FunctionComponent: {
			const Component = workInProgress.type;
			const props = workInProgress.pendingProps;
			
			console.log('Function Component props:', props);
			// 함수형 컴포넌트 실행해 자식 엘리먼트 얻기
			const nextChildren = Component(props);
			
			reconcileChildren(current, workInProgress, nextChildren);
			return workInProgress.child;
		}
		
		case ClassComponent: {
			const Component = workInProgress.type;
			const props = workInProgress.pendingProps;
			
			// 클래스 인스턴스가 없으면 생성
			let instance = workInProgress.stateNode;
			if (instance === null) {
				instance = new Component(props);
				workInProgress.stateNode = instance;
			} else {
				instance.props = props;
			}
			
			// render 호출해서 자식 엘리먼트 얻기
			const nextChildren = instance.render();
			
			reconcileChildren(current, workInProgress, nextChildren);
			return workInProgress.child;
		}
		
		case HostComponent: {
			const nextProps = workInProgress.pendingProps;
			const nextChildren = nextProps.children;
			
			// props가 변경되면 Update 플래그 설정
			if (current !== null && current.memoizedProps !== nextProps) {
				workInProgress.flags |= Update;
			}
			
			reconcileChildren(current, workInProgress, nextChildren);
			return workInProgress.child;
		}
		
		case HostText: {
			return null;
		}
	}
}

function reconcileChildren(current, workInProgress, nextChildren) {
	console.log('reconcileChildren input:', {
		current,
		workInProgress,
		nextChildren
	});
	
  // 텍스트 노드 반환
	if (typeof nextChildren === 'string' || typeof nextChildren === 'number') {
		nextChildren = {
			type: TEXT_ELEMENT,
			props: { nodeValue: String(nextChildren) },
			key: null
		};
	}
	
	// 단일 자식이면 배열로 변환 (null, undefined는 제거)
	if (!Array.isArray(nextChildren)) {
		nextChildren = [nextChildren].filter(Boolean);
	}
	
  // 비교 및 업데이트
	let oldFiber = current?.child || null;
	let previousNewFiber = null;
	let newIdx = 0;
	
	// 기존 Fiber와 새로운 자식을 비교하며 업데이트
	for (; oldFiber !== null && newIdx < nextChildren.length; newIdx++) {
    const newChild = nextChildren[newIdx];
		let newFiber;
    const sameType = oldFiber && oldFiber.type === newChild.type;

    if (sameType) {
      // 타입이 같으면 Fiber 노드 업데이트
      newFiber = createFiberFromElement(newChild);
      newFiber.alternate = oldFiber;
      newFiber.flags = Update;
    } else {
      // 타입이 다르면 새로운 Fiber 생성
      newFiber = createFiberFromElement(newChild);
      newFiber.flags = Placement;
    }

		newFiber.return = workInProgress;

    // Fiber 트리 구성
    if (newIdx === 0) {
      workInProgress.child = newFiber;
    } else {
      previousNewFiber.sibling = newFiber;
    }
    previousNewFiber = newFiber;
    oldFiber = oldFiber?.sibling; // 다음 형제 Fiber로 변경
  }

  // 나머지 새로운 자식들 처리
  for (; newIdx < nextChildren.length; newIdx++) {
    const newFiber = createFiberFromElement(nextChildren[newIdx]);
    newFiber.flags = Placement;
    newFiber.return = workInProgress;

    if (newIdx === 0) {
      workInProgress.child = newFiber;
    } else {
      previousNewFiber.sibling = newFiber;
    }
    previousNewFiber = newFiber;

		// newFiber 생성 후
		console.log('Created newFiber:', newFiber);
  }
}

export {
  beginWork
}