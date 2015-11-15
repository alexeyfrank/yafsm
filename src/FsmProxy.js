import { isString, isFunction } from "./Utils";

export class FsmProxy {
  constructor() {
    this.data = {
      states: {},
      events: {},
      afterTransitions: [],
      beforeTransitions: []
    };
  }

  initialState(value) {
    this.data.initialState = value;
  }

  state(stateName) {
    this.data.states[stateName] = true;
  }

  event(eventName, cb) {
    this.data.events[eventName] = [];
    this._currentEventName = eventName;
    cb();
    this._currentEventName = null;
  }

  transition(from, to, options = {}) {
    if (isString(from)) {
      from = [from];
    }
    //TODO: raise if current event name is undefined
    this.data.events[this._currentEventName].push({ from: from, to: to, if: options.if });
  }

  all() {
    return this.data.states;
  }

  without(states) {
    return () => {
      if (isString(states)) { states = [states]; }

      return this.data.states.filter(state => states.indexOf(state) == -1);
    };
  }

  afterTransition(from, to, callback) {
    if (isString(from)) {
      from = [from];
    }
    if (isString(to)) {
      to = [to];
    }
    this.data.afterTransitions.push({from: from, to: to, callback: callback});
  }

  beforeTransition(from, to, callback) {
    if (isString(from)) {
      from = [from];
    }
    if (isString(to)) {
      to = [to];
    }
    this.data.beforeTransitions.push({from: from, to: to, callback: callback});
  }


  changeState({ get, set }) {
    this.data.getState = get;
    this.data.setState = set;
  }

  getData() {
    return this.data;
  }
};
