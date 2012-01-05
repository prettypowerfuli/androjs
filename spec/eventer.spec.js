var Andro = require('../andro').Andro;

var eventer = null;
var bound = {};
beforeEach(function () {
  var andro = new Andro();
  var obj = {};

  andro.setupOwner(obj);
  eventer = andro.getEventer(obj);

  bound = {};
});

describe('eventer', function(){

  it('should trigger a bound callback when event emitted', function(){
    var called = false;
    eventer.bind(bound, "event", function() {
      called = true;
    });

    eventer.emit("event");
    expect(called).toEqual(true);
  });

  it('should call callback with bound obj as context', function(){
    var contextData = null;
    bound.woo = "yeah";
    eventer.bind(bound, "event", function() {
      contextData = this.woo;
    });

    eventer.emit("event");
    expect(contextData).toEqual("yeah");
  });


  it('should send on emitted data to callback', function(){
    var collectedData = null;
    eventer.bind(bound, "event", function(data) {
      collectedData = data;
    });

    eventer.emit("event", "data");
    expect(collectedData).toEqual("data");
  });

  it('should not call callback bound to different event from one emitted', function(){
    var called = false;
    eventer.bind(bound, "event", function() {
      called = true;
    });

    eventer.emit("otherevent");
    expect(called).toEqual(false);
  });

  it('should not call callback previously bound to emitted event', function(){
    var called1 = false, called2 = false;
    eventer.bind(bound, "event", function() {
      called1 = true;
    });

    // callback fired the first time
    eventer.emit("event");
    expect(called1).toEqual(true);

    // but should now not be after unbind
    eventer.unbind(bound, "event");
    eventer.emit("event");
    expect(called2).toEqual(false);
  });
});
