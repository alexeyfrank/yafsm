import {expect} from "chai";
import { FsmProxy } from "../src/FsmProxy";
import { Fsm } from "../src/Fsm";
import { build } from "../src/FsmBuilder";

describe('FSM builder test suite', function() {
  var fsm;

  beforeEach(function() {
    const buildFn = function(fsm) {
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

    fsm = new Fsm(buildFn);
  });

  it('has valid events and transitions', function() {
    expect(fsm.connect).to.be.a("function");
    expect(fsm.disconnect).to.be.a("function");

    expect(fsm.getState()).to.equal('new');
    expect(fsm.can('connect')).to.equal(true);
    expect(fsm.can('disconnect')).to.equal(false);

    fsm.connect();
    expect(fsm.getState()).to.equal('connected');
    expect(fsm.can('connect')).to.equal(false);
    expect(fsm.can('disconnect')).to.equal(true);

    fsm.disconnect();
    expect(fsm.getState()).to.equal('disconnected');
    expect(fsm.can('connect')).to.equal(true);
    expect(fsm.can('disconnect')).to.equal(false);

    fsm.connect();
    expect(fsm.getState()).to.equal('connected');
  });
});
