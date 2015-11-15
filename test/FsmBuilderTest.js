import {expect} from "chai";
import { FsmProxy } from "../src/FsmProxy";
import { build } from "../src/FsmBuilder";

describe('FSM builder test suite', function() {
  var proxy;

  beforeEach(function() {
    const fsm = function(fsm) {
      fsm.initialState('new');
      fsm.state('new');
      fsm.state('disconnected');
      fsm.state('connected');

      fsm.event('connect', function() {
        fsm.transition('new', 'connected');
        fsm.transition('disconnected', 'connected');
      });

      fsm.event('disconnect', function() {
        fsm.transition('connected', 'disconnected');
      });
    };

    proxy = new FsmProxy();
    fsm(proxy);
  });

  it('has valid events and transitions', function() {
    const fsm = build(proxy.getData(), {});

    expect(fsm.connect).to.be.a('function');
    expect(fsm.disconnect).to.be.a('function');
  });
});
