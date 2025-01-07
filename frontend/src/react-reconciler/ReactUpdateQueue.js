function initializeUpdateQueue(fiber) {
  fiber.updateQueue = {
    baseState: fiber.memoizedState,
    firstBaseUpdate: null,
    lastBaseUpdate: null,
    shared: {
      pending: null,
      interleaved: null,
    },
    effects: null
  };
}

function enqueueUpdate(fiber, update) {
  // 업데이트 큐 가져오기
  const updateQueue = fiber.updateQueue;
  const sharedQueue = updateQueue.shared;
  const pending = sharedQueue.pending;

  if (pending === null) {
    update.next = update;
  } else {
    // 기존 업데이트가 있는 경우 연결 리스트에 추가
    update.next = pending.next;
    pending.next = update;
  }

  sharedQueue.pending = update;
}

export {
  initializeUpdateQueue,
  enqueueUpdate
}