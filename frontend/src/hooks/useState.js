import { variable } from "../react.js";
import { updateComponent } from "../reconciler/updateComponent.js";

let states = [];
let updateQueue = [];

export function useState(initialState) {
  const component = variable._currentComponent;

  if (states.length === variable._stateKey) {
    states.push(initialState);
  }

  const currentIndex = variable._stateKey;
  const state = states[variable._stateKey];

  const setState = (newState) => {
    if (typeof newState === 'function') {
      newState = newState(states[currentIndex]);
    }

    if (newState === states[currentIndex]) return;
    if (JSON.stringify(newState) === JSON.stringify(states[currentIndex])) return;

    states[currentIndex] = newState;
    
    updateQueue.push(component);
    scheduleUpdate();
  };

  variable._stateKey += 1;
  return [state, setState];
};

function scheduleUpdate() {
  setTimeout(() => {
    while (updateQueue.length > 0) {
      const component = updateQueue.shift();
      updateComponent(component);
    }
  }, 0);
};