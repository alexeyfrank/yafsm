import { isString, isFunction } from "./Utils";
import { FsmProxy } from "./FsmProxy";
import { build } from "./FsmBuilder";

export class Fsm {
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

  setState(newState) {
    const oldState = this.state;
    this._setContextState(newState);

    var transitions = this.params.afterTransitions;
    for (var i = 0, l = transitions.length; i < l; i++) {
      if (transitions[i].from().indexOf(oldState) != -1 && transitions[i].to().indexOf(newState) != -1) {
        var callback = transitions[i].callback;
        if (isString(callback)) {
          this._context[callback]();
        } else {
          callback.call(this._context);
        }
      }
    }
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
      if (_.contains(transition.from, state)) {
        if (transition.if && !transition.if(...args)) { continue; }

        this._goToState(transition.to);
        return true;

      }
    }
    return false;
  }

  _runCallbacks(transitions, oldState, newState) {
    transitions.forEach((transition) => {
      if (_.contains(transition.from, oldState)
        && _.contains(transition.to, newState)) {
          const callback = transitions[i].callback;
          callback(oldState, newState);
        }
    });
  }

  _goToState(newState) {
    const oldState = this._getContextState();

    this._runCallbacks(this.params.beforeTransitions, oldState, newState);
    this.setState(newState);
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
