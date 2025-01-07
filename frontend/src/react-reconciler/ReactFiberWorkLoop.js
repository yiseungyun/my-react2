import { commitRoot } from "./ReactFiberCommitWork";

function scheduleUpdateOnFiber(root) {
  // 우선순위 계산
  const priority = getCurrentPriorityLevel();
  
  if (priority === SyncLane) { // 동기적으로 처리해야 하는 경우
    performSyncWorkOnRoot(root);
  } else { // 비동기 업데이트의 경우 스케줄링
    ensureRootIsScheduled(root);
  }
}

function ensureRootIsScheduled(root) { // 루트 스케줄링 보장
  const existingCallbackNode = root.callbackNode;

  // 이미 스케줄된 작업이 있다면 취소
  if (existingCallbackNode !== null) {
    cancelCallback(existingCallbackNode);
  }

  // 새로운 작업 스케줄링
  const newCallbackNode = scheduleCallback(
    schedulerPriorityLevel,
    performConcurrentWorkOnRoot.bind(null, root)
  );

  root.callbackNode = newCallbackNode;
}

function performSyncWorkOnRoot(root) {
  // 1. 렌더 단계: Fiber 트리 구축
  const finishedWork = renderRootSync(root);
  root.finishedWork = finishedWork;

  // TODO: 2. 커밋 단계: DOM 업데이트
  commitRoot(root);
}

function renderRootSync(root) {
  // 현재 우선순위 저장
  const prevPriority = currentUpdatePriority;
  currentUpdatePriority = SyncLane;
  
  try {
    // 워크루프 실행
    workLoopSync(root);
    
    // 완료된 작업 반환
    return root.current.alternate;
  } finally {
    // 이전 우선순위 복원
    currentUpdatePriority = prevPriority;
  }
}

function workLoopSync() {
  // workInProgress가 null이 될 때까지 반복
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress);
  }
}

export {
  scheduleUpdateOnFiber,
  ensureRootIsScheduled,
  performSyncWorkOnRoot,
  renderRootSync,
  workLoopSync
}