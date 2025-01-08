import { scheduleUpdateOnFiber } from './ReactFiberWorkLoop.js';
import { enqueueUpdate } from './ReactUpdateQueue.js';

function updateContainer(element, root) {
  const current = root.current;

  current.pendingProps = { element };

  // 업데이트 생성 및 예약
  const update = {
    payload: { element },
    next: null,
  };

  // 업데이트 큐에 추가
  enqueueUpdate(current, update);

  // 렌더링 스케줄링 시작
  scheduleUpdateOnFiber(root);
}

export { updateContainer };
