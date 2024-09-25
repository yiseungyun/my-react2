const createUseState = () => {
  const states = {};
  let currentComponent = null; // TODO: 컴포넌트 별 고유 id (구현 X)
  let currentIndex = 0;

	const useState = (initState) => {
    if (states[currentComponent] === undefined) {
      states[currentComponent] = [];
    }
		
    const stateList = states[currentComponent];

    if (stateList[currentIndex] === undefined) {
      stateList[currentIndex] = initState;
    }

    const state = stateList[currentIndex];

    const setState = (newState) => {
      if (newState === state) return;
      if (JSON.stringify(newState) === JSON.stringify(state)) return;

      stateList[currentIndex] = newState;
      // TODO: 렌더링
    }

    currentIndex++;
		return [state, setState];
	}
	
	return useState;
}