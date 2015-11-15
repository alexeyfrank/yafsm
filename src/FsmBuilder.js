import { capitalize, isFunction } from "./Utils";

export function build(params, fsm) {
  params.afterTransitions = params.afterTransitions.map(buildTransition);
  params.beforeTransitions = params.beforeTransitions.map(buildTransition);

  Object.keys(params.events).forEach((eventName) => {
    fsm[eventName] = buildEventMethod(eventName);
    fsm["can" + capitalize(eventName)] = buildCheckEventMethod(eventName);
  });

  if (!isFunction(params.getState) || !isFunction(params.setState)) {
    params = buildDefaultStateMethods(params);
  }

  fsm.params = params;

  return fsm;
}


function buildTransition(transition) {
  transition.from = transition.from();
  transition.to = transition.to();

  return transition;
}

function buildDefaultStateMethods(params) {
  var state = "";
  params.getState = () => state;
  params.setState = (newState) => state = newState;

  return params;
}

function buildEventMethod(eventName) {
  return function() {
    return this.run(eventName);
  }
}

function buildCheckEventMethod(eventName) {
  return function() {
    return this.can(eventName);
  }
}
