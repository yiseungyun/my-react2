import { createWorkInProgress } from './ReactFiber.js';
import { beginWork } from './ReactFiberBeginWork.js';
import { commitRoot } from './ReactFiberCommitWork.js';
import { completeWork } from './ReactFiberCompleteWork.js';

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
    return workInProgress;
  } finally {
    // TODO: 이전 우선순위 복원
  }
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
    const current = completedWork.alternate || null;

    completeWork(current, completedWork);

    const siblingFiber = completedWork.sibling;
    if (siblingFiber !== null) {
      workInProgress = siblingFiber;
      return;
    }

    completedWork = completedWork.return;

    if (completedWork === null) {
      workInProgress = null;
      return;
    }
  } while (completedWork !== null);
}

export { scheduleUpdateOnFiber };
