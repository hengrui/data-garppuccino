var _ = module.exports = {};

//reference to use __line, __file variables
// http://stackoverflow.com/questions/11386492/accessing-line-number-in-v8-javascript-chrome-node-js
Object.defineProperty(global, '__stack', {
  get: function(){
    var orig = Error.prepareStackTrace;
    Error.prepareStackTrace = function(_, stack){ return stack; };
    var err = new Error;
    Error.captureStackTrace(err, arguments.callee);
    var stack = err.stack;
    Error.prepareStackTrace = orig;
    return stack;
  }
});

Object.defineProperty(global, '__line', {
  get: function(){
    return __stack[1].getLineNumber();
  }
});

Object.defineProperty(global, '__file', {
  get: function(){
    return __stack[1].getFileName().split('/').slice(-1)[0];
  }
});

//underscore
_._ = require("underscore");

// reference
// https://github.com/janogonzalez/priorityqueuejs
var pq = require("priorityqueuejs");
_.PriorityQueue = function(params) {
	params.comparator || console.log('no comparator ' + __file + __line);
	this._ = new pq(params.comparator);
	this.empty = function() {
		return this._.size() == 0;
	}
  this.size = function() {
    return this._.size();
  }
	this.dequeue = function() {
		return this._.deq();
	}
	this.push = this.enqueue = function(elem) {
		return this._.enq(elem)
	}
}