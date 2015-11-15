import { capitalize, isFunction } from "./Utils";

export function build(params, fsm) {
  params.afterTransitions.forEach((transition) => {
    if (isFunction(transition.from)) {
      transition.from = transition.from(fsm.getStates());
    }
    if (isFunction(transition.to)) {
      transition.to = transition.to(fsm.getStates());
    }
  });

  params.beforeTransitions.forEach((transition) => {
    if (isFunction(transition.from)) {
      transition.from = transition.from(fsm.getStates());
    }
    if (isFunction(transition.to)) {
      transition.to = transition.to(fsm.getStates());
    }
  });

  if (!isFunction(params.getState) || !isFunction(params.setState)) {
    (function() {
      var state = "";
      params.getState = () => state;
      params.setState = (newState) => state = newState;
    }());
  }

  fsm.params = params;

  for (const eventName in params.events) {
    fsm[eventName] = buildEventMethod(eventName);
    fsm["can" + capitalize(eventName)] = buildCheckEventMethod(eventName);
  }

  return fsm;
}

function buildEventMethod(eventName) {
  return function() {
    this.run(eventName);
  }
}

function buildCheckEventMethod(eventName) {
  return function() {
    this.can(eventName);
  }
}
