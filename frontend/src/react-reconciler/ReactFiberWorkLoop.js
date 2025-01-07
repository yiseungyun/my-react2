function scheduleUpdateOnFiber(root) {
  // 1. 우선순위 계산
  const priority = getCurrentPriorityLevel();
  
  if (priority === SyncLane) { // 2. 동기적으로 처리해야 하는 경우
    performSyncWorkOnRoot(root);
  } else { // 3. 비동기 업데이트의 경우 스케줄링
    ensureRootIsScheduled(root);
  }
}
export {
  scheduleUpdateOnFiber
}