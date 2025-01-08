import { Deletion, Placement, Update } from "./ReactFiberFlag.js";

function commitRoot(root) {
  const finishedWork = root.finishedWork;
  
  // 완료된 작업이 없으면 종료
  if (finishedWork === null) {
    return null;
  }

  root.finishedWork = null;

  // 1. DOM 변경 전 필요한 정리 작업
  commitBeforeMutationEffects(finishedWork);

  // 2. DOM 변경
  commitMutationEffects(root, finishedWork);

  // 변경 완료된 트리를 current로 설정
  root.current = finishedWork;

  // 3. DOM 변경 후 작업 처리
  commitLayoutEffects(finishedWork);
}

function commitBeforeMutationEffects(finishedWork) {
  let nextEffect = finishedWork;

  while (nextEffect !== null) {
    const flags = nextEffect.flags;

    if (flags & Snapshot) {
      commitBeforeMutationEffectOnFiber(nextEffect);
    }

    nextEffect = nextEffect.nextEffect;
  }
}

function commitMutationEffects(root, finishedWork) {
  let nextEffect = finishedWork;

  while (nextEffect !== null) {
    const flags = nextEffect.flags;

    // DOM 노드 추가/이동
    if (flags & Placement) {
      commitPlacement(nextEffect);
    }

    // DOM 노드 업데이트
    if (flags & Update) {
      commitWork(nextEffect);
    }

    // DOM 노드 삭제
    if (flags & Deletion) {
      commitDeletion(root, nextEffect);
    }

    nextEffect = nextEffect.nextEffect;
  }
}

function commitPlacement(finishedWork) {
  const parentFiber = getHostParentFiber(finishedWork);
  const parentNode = parentFiber.stateNode;

  if (finishedWork.stateNode !== null) {
    parentNode.appendChild(finishedWork.stateNode);
  }
}

function commitWork(finishedWork) {
  const newProps = finishedWork.pendingProps;
  const oldProps = finishedWork.memoizedProps;
  const domNode = finishedWork.stateNode;

  updateDOMProperties(domNode, oldProps, newProps);
}

function commitDeletion(root, finishedWork) {
  commitNestedUnmounts(root, finishedWork);
  
  const parentFiber = getHostParentFiber(finishedWork);
  const parentNode = parentFiber.stateNode;
  
  if (finishedWork.stateNode !== null) {
    parentNode.removeChild(finishedWork.stateNode);
  }
}

function commitLayoutEffects(finishedWork, root) {
  let nextEffect = finishedWork;

  while (nextEffect !== null) {
    const flags = nextEffect.flags;

    if (flags & Update) {
      commitLayoutEffectOnFiber(root, nextEffect);
    }

    nextEffect = nextEffect.nextEffect;
  }
}

function commitBeforeMutationEffectOnFiber(finishedWork) {
  const current = finishedWork.alternate;
  const tag = finishedWork.tag;

  // 클래스 컴포넌트
  if (tag === ClassComponent) {
    // getSnapshotBeforeUpdate 생명주기 메서드 호출
    if (current !== null) {
      const prevProps = current.memoizedProps;
      const prevState = current.memoizedState;
      const instance = finishedWork.stateNode;
      
      // getSnapshotBeforeUpdate가 있는 경우에만 호출
      if (instance.getSnapshotBeforeUpdate) {
        const snapshot = instance.getSnapshotBeforeUpdate(prevProps, prevState);
        // 스냅샷을 인스턴스에 저장하여 나중에 사용
        instance.__reactInternalSnapshotBeforeUpdate = snapshot;
      }
    }
  }
}

function commitLayoutEffectOnFiber(root, finishedWork) {
  const tag = finishedWork.tag;
  const current = finishedWork.alternate;
  const instance = finishedWork.stateNode;

  if (tag === ClassComponent) {
    // 클래스 컴포넌트의 경우
    if (current === null) {
      // 최초 마운트: componentDidMount 호출
      if (instance.componentDidMount) {
        instance.componentDidMount();
      }
    } else {
      // 업데이트: componentDidUpdate 호출
      if (instance.componentDidUpdate) {
        const prevProps = current.memoizedProps;
        const prevState = current.memoizedState;
        const snapshot = instance.__reactInternalSnapshotBeforeUpdate;
        
        instance.componentDidUpdate(prevProps, prevState, snapshot);
        // 스냅샷 정리
        instance.__reactInternalSnapshotBeforeUpdate = null;
      }
    }
  } else if (tag === FunctionComponent) {
    // 함수형 컴포넌트의 경우
    // useLayoutEffect 훅의 이펙트 실행
    const updateQueue = finishedWork.updateQueue;
    if (updateQueue !== null) {
      const effects = updateQueue.effects;
      if (effects !== null) {
        effects.forEach(effect => {
          if (effect.destroy !== undefined) {
            effect.destroy();
          }
          if (effect.create !== undefined) {
            effect.destroy = effect.create();
          }
        });
      }
    }
  }
}

function commitNestedUnmounts(root, finishedWork) {
  let node = finishedWork;
  
  while (true) {
    commitUnmount(root, node);
    
    if (node.child !== null) {
      node = node.child;
      continue;
    }
    
    if (node === finishedWork) {
      return;
    }
    
    while (node.sibling === null) {
      if (node.return === null || node.return === finishedWork) {
        return;
      }
      node = node.return;
    }
    
    node = node.sibling;
  }
}

export {
  commitRoot
}