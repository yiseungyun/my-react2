import { beginWork } from "./ReactFiberBeginWork.js";
import { commitRoot } from "./ReactFiberCommitWork.js";
import { completeWork } from "./ReactFiberCompleteWork.js";

let workInProgress = null;

function scheduleUpdateOnFiber(root) {
  // TODO: 우선순위 계산
  performSyncWorkOnRoot(root);
  
  // TODO: 비동기 업데이트의 경우 스케줄링 
}

function performSyncWorkOnRoot(root) {
  // 1. 렌더 단계: Fiber 트리 구축
  const finishedWork = renderRootSync(root);
  root.finishedWork = finishedWork;

  // TODO: 2. 커밋 단계: DOM 업데이트
  commitRoot(root);
}

function renderRootSync(root) {
  // TODO: 현재 우선순위 저장
  const current = root.current;
  workInProgress = createWorkInProgress(current, null);
  
  try {
    // 워크루프 실행
    workLoopSync(root);
    
    // 완료된 작업 반환
    console.log("workInProgress", workInProgress);
    return workInProgress;
  } finally {
    // TODO: 이전 우선순위 복원
  }
}

function createWorkInProgress(current, pendingProps) {
  if (!current) return null;
  let workInProgress = current.alternate;

  if (workInProgress === null) {
    workInProgress = {
      ...current,
      alternate: current,
      pendingProps: pendingProps || current.pendingProps,
      flags: 0,
      child: null,
      memoizedProps: null,
      memoizedState: null
    };
    current.alternate = workInProgress;
  } else {
    workInProgress.pendingProps = pendingProps || current.pendingProps;
    workInProgress.flags = 0;
    workInProgress.child = null;
    current.alternate = workInProgress;
  }

  return workInProgress;
}

function workLoopSync() {
  // workInProgress가 null이 될 때까지 반복
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress);
  }
}

function performUnitOfWork(unitOfWork) {
  // 현재 작업 중인 Fiber의 alternate 가져오기
  const current = unitOfWork.alternate || null;

  // beginWork를 호출하여 자식 Fiber들 처리
  let next = beginWork(current, unitOfWork);

  // pendingProps를 memoizedProps로 저장
  // 이는 다음 렌더링에서 props 비교에 사용
  unitOfWork.memoizedProps = unitOfWork.pendingProps;

  if (next === null) {
    // 자식이 없다면 완료 단계로 진입
    completeUnitOfWork(unitOfWork);
  } else {
    // 자식이 있다면 다음 작업 단위를 설정
    workInProgress = next;
  }
}

function completeUnitOfWork(unitOfWork) {
  let completedWork = unitOfWork;

  do {
    // 현재 Fiber의 alternate 가져오기
    const current = completedWork.alternate || null;
    // 부모 Fiber를 가져오기
    const returnFiber = completedWork.return || null;

    if (returnFiber === null && completedWork !== null) {
      workInProgress = null;
      return;
    }

    // 현재 Fiber 노드의 작업을 완료
    completeWork(current, completedWork);

    // 형제가 있다면 그 형제로 이동
    const siblingFiber = completedWork.sibling;
    if (siblingFiber !== null) {
      // 형제가 있으면 workInProgress를 형제로 설정하고 종료
      workInProgress = siblingFiber;
      return;
    }

    // 형제가 없으면 부모로 올라가기
    completedWork = returnFiber;
    if (completedWork === null) {
      workInProgress = null;
      return;
    }
    workInProgress = completedWork;
  } while (completedWork !== null);
}

export {
  scheduleUpdateOnFiber
}