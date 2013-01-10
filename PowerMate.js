var fs = require('fs'),
    glob = require("glob"),
    EventEmitter = require('events').EventEmitter;

// Expose as a nice JavaScript API
function PowerMate() {
  if (process.arch.match('64')) {
    this.offset = 0;
    this.arch = 64;
  } else {
    this.offset = 8;
    this.arch = 32;
  }
  this.wrap("onOpen");
  this.wrap("onRead");
  this.position = 0;
  this.buffer = new Buffer(this.arch);
  self = this;

  glob("/dev/input/by-id/*PowerMate*", function (err, files) {
    if (err) return self.emit("error", err);
    if (!files[0]) return self.emit("error", 'PowerMate not found');
    self.path = files[0];
    fs.open(self.path, "r", self.onOpen);
  });
}
PowerMate.prototype = Object.create(EventEmitter.prototype, {
  constructor: {value: PowerMate}
});

// Register a bound version of a method and route errors
PowerMate.prototype.wrap = function (name) {
  var self = this;
  var fn = this[name];
  this[name] = function (err) {
    if (err) return self.emit("error", err);
    return fn.apply(self, Array.prototype.slice.call(arguments, 1));
  };
};

PowerMate.prototype.onOpen = function (fd) {
  this.fd = fd;
  this.startRead();
};

PowerMate.prototype.startRead = function () {
  fs.read(this.fd, this.buffer, 0, this.arch, null, this.onRead);
};

PowerMate.prototype.onRead = function (bytesRead) {
    var data = {
        axis: this.buffer.readUInt16LE(16 - this.offset),
        action: this.buffer.readUInt16LE(20 - this.offset),
    };
    var self = this;
    if (data.axis == 1) {
        if (data.action == 1) { //down
            self.position = 1;
            self.down = setTimeout(function() {
              self.emit('longPress');
            }, 1000);
        } else if (data.action == 0) { //up
            self.position = 0; 
            if (self.down._idleNext) self.emit('press');
            clearTimeout(self.down);
      }
    } if (data.axis == 2) {
        if (data.action == 1) { //right
            clearTimeout(self.down);
            if (self.position) {
                self.emit('downRight');
            } else {
                self.emit('right');
            }
        } else if (data.action > 1) { //left
            clearTimeout(self.down);
            if (self.position) {
                self.emit('downLeft');
            } else {
                self.emit('left');
            }
        }
    }
    if (this.fd) this.startRead();
};

PowerMate.prototype.close = function (callback) {
  fs.close(this.fd, callback);
  this.fd = undefined;
};

module.exports = PowerMate;