(function() {
  var Timer;
  window.Timer = Timer = (function() {
    function Timer(world, interval, callback) {
      this.world = world;
      this.interval = interval;
      this.callback = callback;
      this.interval || (this.interval = 1);
      this.callback || (this.callback = null);
      this.running = true;
      this.accum = 0;
      this.world.add_timer(this);
    }
    Timer.prototype.start = function() {
      return this.running = true;
    };
    Timer.prototype.pause = function() {
      return this.running = false;
    };
    Timer.prototype.stop = function() {
      this.running = false;
      return this.accum = 0;
    };
    Timer.prototype.restart = function() {
      this.running = true;
      return this.accum = 0;
    };
    Timer.prototype.step = function(dt) {
      if (!this.running) {
        return;
      }
      this.accum += dt;
      if (this.accum >= this.interval) {
        while (this.accum >= this.interval) {
          this.accum = this.interval - this.accum;
        }
        return typeof this.callback == "function" ? this.callback() : void 0;
      }
    };
    return Timer;
  })();
}).call(this);
