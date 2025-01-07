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

export {
  commitRoot
}