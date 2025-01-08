import { ClassComponent, FunctionComponent, HostComponent, HostRoot, HostText } from "./ReactWorkTag.js";

function completeWork(current, workInProgress) {
	switch (workInProgress.tag) {
		case HostRoot: { // 리액트 트리 최상위 노드
			const rootContainerInstance = workInProgress.stateNode.containerInfo;
			appendAllChildren(rootContainerInstance, workInProgress);
			
			const child = workInProgress.child;
			if (child !== null) {
				workInProgress.stateNode.pendingChildren = child;
			}
			
			return null;
		}
		
		case HostComponent: {
			const type = workInProgress.type;
			const newProps = workInProgress.pendingProps;

			if (current === null) { // 최초 마운트
				const domElement = document.createElement(type);
				updateDOMProperties(domElement, null, newProps);
				workInProgress.stateNode = domElement;
				appendAllChildren(domElement, workInProgress);
			} else { // 업데이트
				const instance = workInProgress.stateNode;
				
				// props가 변경된 경우
				if (workInProgress.flags & Update) {
					updateDOMProperties(
						instance,
						current.memoizedProps,
						newProps
					);
				}
			}
			
			return null;
		}
		
		case HostText: { // 텍스트 노드
			const newText = workInProgress.pendingProps;
			
			if (current === null) { // 최초 마운트
				const textNode = document.createTextNode(newText);
				workInProgress.stateNode = textNode;
			} else if (workInProgress.flags & Update) { // 업데이트이고 텍스트가 변경된 경우
				const textNode = workInProgress.stateNode;
				textNode.nodeValue = newText;
			}
			
			return null;
		}
		
		case FunctionComponent:
		case ClassComponent: { // 컴포넌트는 특별한 처리 없이 반환 
			return null;
		}
	}
}

// DOM 속성 업데이트 함수
function updateDOMProperties(domElement, oldProps, newProps) {
  // 이전 props의 이벤트 리스너와 속성들 제거
  if (oldProps) {
    for (const propKey in oldProps) {
      if (!(propKey in newProps)) {
        if (propKey.startsWith('on')) {
          // 이벤트 리스너 제거
          const eventType = propKey.toLowerCase().slice(2);
          domElement.removeEventListener(eventType, oldProps[propKey]);
        } else {
          // 일반 속성 제거
          domElement.removeAttribute(propKey);
        }
      }
    }
  }

  // 새로운 props의 이벤트 리스너와 속성 설정
  for (const propKey in newProps) {
    const newValue = newProps[propKey];
    const oldValue = oldProps ? oldProps[propKey] : undefined;

    if (newValue !== oldValue) {
      if (propKey.startsWith('on')) {
        // 이벤트 리스너 처리
        const eventType = propKey.toLowerCase().slice(2);
        if (oldValue) {
          domElement.removeEventListener(eventType, oldValue);
        }
        domElement.addEventListener(eventType, newValue);
      } else if (propKey === 'style') {
        // 스타일 객체 처리
        Object.assign(domElement.style, newValue);
      } else if (propKey === 'children') {
        // children prop은 DOM 속성으로 설정 X
        continue;
      } else {
        // 일반 속성 설정
        domElement.setAttribute(propKey, newValue);
      }
    }
  }
}

// 자식 노드들을 DOM에 추가하는 함수
function appendAllChildren(parentInstance, workInProgress) {
  let node = workInProgress.child;
  
  while (node !== null) {
    if (node.tag === HostComponent || node.tag === HostText) {
      // DOM 노드인 경우 직접 추가
      parentInstance.appendChild(node.stateNode);
    } else if (node.child !== null) {
      // 컴포넌트인 경우 자식으로 이동
      node = node.child;
      continue;
    }

    if (node === workInProgress) {
      return;
    }

    // 형제나 부모의 형제를 찾아 이동
    while (node.sibling === null) {
      if (node.return === null || node.return === workInProgress) {
        return;
      }
      node = node.return;
    }
    node = node.sibling;
  }
}

export {
  completeWork
}