import {expect} from "chai";
import { FsmProxy } from "../src/FsmProxy";

describe('FSM proxy test suite', function() {
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
    };

    proxy = new FsmProxy();

    fsm(proxy);
  });

  it('has valid events and transitions', function() {
    var data = proxy.getData();

    expect(data.initialState).to.equal('new');
    expect(data.states['new']).to.equal(true);
    expect(data.states['connected']).to.equal(true);

    expect(data.events.connect[0].from[0]).to.equal('new');
    expect(data.events.connect[0].to).to.equal('connected');

    expect(data.events.connect[1].from[0]).to.equal('disconnected');
    expect(data.events.connect[1].to).to.equal('connected');
  });
});
