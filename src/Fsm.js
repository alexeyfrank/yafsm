import { isString, isFunction, contains } from "./Utils";
import { FsmProxy } from "./FsmProxy";
import { build } from "./FsmBuilder";

export class Fsm {
  static build(buildFn) {
    return new Fsm(buildFn);
  }

  constructor(buildFn) {
    const proxy = new FsmProxy();
    buildFn(proxy);

    build(proxy.getData(), this);

    this.setInitialState(this.params.initialState);
  }

  can(eventName) {
    return this._canEvent(eventName);
  }

  run(eventName) {
    return this._runEvent(eventName);
  }

  setInitialState(newState) {
    this._setContextState(newState);
  }

  getState() {
    return this._getContextState();
  }

  getStates() {
    return Object.keys(this.params.states);
  }

  _getContextState() {
    return this.params.getState();
  }

  _setContextState(newState) {
    return this.params.setState(newState);
  }

  _runEvent(eventName, args) {
    const transitions = this.params.events[eventName];
    const state = this._getContextState();

    for (var i = 0, l = transitions.length; i < l; i++) {
      var transition = transitions[i];
      if (contains(transition.from, state)) {
        if (transition.if && !transition.if(...args)) { continue; }

        this._goToState(transition.to);
        return true;

      }
    }
    return false;
  }

  _runCallbacks(transitions, oldState, newState) {
    transitions.forEach((transition) => {
      if (contains(transition.from, oldState)
        && contains(transition.to, newState)) {
          const callback = transition.callback;
          callback(oldState, newState);
        }
    });
  }

  _goToState(newState) {
    const oldState = this._getContextState();

    this._runCallbacks(this.params.beforeTransitions, oldState, newState);
    this._setContextState(newState);
    this._runCallbacks(this.params.afterTransitions, oldState, newState);
  }

  _canEvent(eventName) {
    const state = this._getContextState();
    const transitions = this.params.events[eventName];
    for (var i = 0, l = transitions.length; i < l; i++) {
      if (transitions[i].from.indexOf(state) != -1) {
        return true;
      }
    }
    return false;
  }
};
