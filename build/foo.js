(function() {
  var KeyBindings, mainloop;
  var __hasProp = Object.prototype.hasOwnProperty;
  window.onload = function() {
    var canvas, ctx, dt, game, interval, steps;
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    window.keybindings = new KeyBindings();
    game = new Game(canvas, window.keybindings);
    canvas.onmousemove = function(e) {};
    canvas.onmousedown = function(e) {
      if (e.button === 0) {
        return window.onkeydown({
          which: 16
        });
      }
    };
    canvas.onmouseup = function(e) {
      if (e.button === 0) {
        return window.onkeyup({
          which: 16
        });
      }
    };
    interval = 30;
    dt = 0.01;
    steps = interval / dt / 1000;
    return setInterval(function() {
      return mainloop(game, ctx, canvas, dt, steps);
    }, interval);
  };
  mainloop = function(game, ctx, canvas, dt, steps) {
    var i;
    for (i = 0; (0 <= steps ? i < steps : i > steps); (0 <= steps ? i += 1 : i -= 1)) {
      game.step(dt);
      keybindings.step(dt);
    }
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.draw(ctx);
    return ctx.restore();
  };
  window.onkeydown = function(key) {
    return this.keybindings.keydown(key);
  };
  window.onkeyup = function(key) {
    return this.keybindings.keyup(key);
  };
  KeyBindings = (function() {
    function KeyBindings() {
      this.bindings = {};
      this.active_bindings = {};
    }
    KeyBindings.prototype.enable = function(key, down, up, during) {
      return this.bindings[key] = {
        down: down,
        up: up,
        during: during
      };
    };
    KeyBindings.prototype.disable = function(key) {
      var active_binding, _ref;
      active_binding = this.active_bindings[key];
      if ((_ref = this.bindings[key]) != null) {
        if (typeof _ref.up == "function") {
          _ref.up();
        }
      }
      delete this.bindings[key];
      return delete this.active_bindings[key];
    };
    KeyBindings.prototype.step = function(dt) {
      var during, i, _base, _ref, _results;
      _ref = this.active_bindings;
      _results = [];
      for (i in _ref) {
        if (!__hasProp.call(_ref, i)) continue;
        during = typeof (_base = this.active_bindings[i]).during == "function" ? _base.during(dt) : void 0;
        _results.push(this.active_bindings[i].called = true);
      }
      return _results;
    };
    KeyBindings.prototype.keydown = function(key) {
      var k, _base;
      k = key.which;
      if (k in this.bindings && !(k in this.active_bindings)) {
        if (typeof (_base = this.bindings[k]).down == "function") {
          _base.down();
        }
        return this.active_bindings[k] = {
          during: this.bindings[k].during,
          called: false
        };
      }
    };
    KeyBindings.prototype.keyup = function(key) {
      var called, during, k, _base, _ref;
      k = key.which;
      if (k in this.active_bindings) {
        _ref = this.active_bindings[k], during = _ref.during, called = _ref.called;
        if (!called) {
          if (typeof during == "function") {
            during();
          }
        }
        delete this.active_bindings[k];
        return typeof (_base = this.bindings[k]).up == "function" ? _base.up() : void 0;
      }
    };
    return KeyBindings;
  })();
}).call(this);
