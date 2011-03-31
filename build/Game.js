(function() {
  var Game;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty;
  window.Game = Game = (function() {
    function Game(canvas, bindings) {
      this.canvas = canvas;
      this.bindings = bindings;
      this.width = this.canvas.width;
      this.height = this.canvas.height;
      this.world = this.create_world();
      this.player = this.create_player();
      this.spawner = this.create_spawner();
      this.pause = false;
      this.game_over = false;
      this.time_factor = 1;
      this.time_factor_display = false;
      this.keys = this.create_keys();
      this.texts = this.create_texts();
      this.actions = this.create_actions();
      this.set_bindings();
    }
    Game.prototype.create_keys = function() {
      return {
        up: [87, 75, 38],
        left: [65, 72, 37],
        down: [83, 74, 40],
        right: [68, 76, 39],
        shoot: [16, 32],
        pause: [80],
        mute: [77],
        time_slower: [189],
        time_faster: [187],
        time_normal: [48]
      };
    };
    Game.prototype.create_texts = function() {
      return {
        reload: "Reload with F5 or Ctrl+R to play it again!",
        game_over: "GAME OVER",
        score: function(score) {
          if (score === 1) {
            return "" + score + " point";
          } else {
            return "" + score + " points";
          }
        },
        time_factor_display: function(tf) {
          tf = Math.round(tf * 100) / 100;
          return "" + tf + " time";
        }
      };
    };
    Game.prototype.create_actions = function() {
      return {
        up: [
          __bind(function(dt) {
            return this.player.move_up_on(dt);
          }, this), __bind(function(dt) {
            return this.player.move_up_off(dt);
          }, this), null
        ],
        left: [
          __bind(function(dt) {
            return this.player.move_left_on(dt);
          }, this), __bind(function(dt) {
            return this.player.move_left_off(dt);
          }, this), null
        ],
        down: [
          __bind(function(dt) {
            return this.player.move_down_on(dt);
          }, this), __bind(function(dt) {
            return this.player.move_down_off(dt);
          }, this), null
        ],
        right: [
          __bind(function(dt) {
            return this.player.move_right_on(dt);
          }, this), __bind(function(dt) {
            return this.player.move_right_off(dt);
          }, this), null
        ],
        shoot: [
          __bind(function() {
            return this.player.shoot_on();
          }, this), __bind(function() {
            return this.player.shoot_off();
          }, this), __bind(function(dt) {
            return this.player.shoot(dt);
          }, this)
        ],
        pause: [
          null, (__bind(function() {
            return this.switch_pause();
          }, this)), null
        ],
        mute: [
          null, (__bind(function() {
            return this.world.switch_mute();
          }, this)), null
        ],
        time_slower: [
          __bind(function() {
            return this.time_display(true);
          }, this), __bind(function() {
            return this.time_display(false);
          }, this), __bind(function(dt) {
            return this.time_slower(dt);
          }, this)
        ],
        time_faster: [
          __bind(function() {
            return this.time_display(true);
          }, this), __bind(function() {
            return this.time_display(false);
          }, this), __bind(function(dt) {
            return this.time_faster(dt);
          }, this)
        ],
        time_normal: [
          null, (__bind(function(dt) {
            return this.time_normal(dt);
          }, this)), null
        ]
      };
    };
    Game.prototype.time_slower = function(dt) {
      return this.time_factor *= 1 - 0.5 * dt;
    };
    Game.prototype.time_faster = function(dt) {
      return this.time_factor = Math.min(this.time_factor * (1 + 0.5 * dt), 16);
    };
    Game.prototype.time_normal = function(dt) {
      return this.time_factor = 1;
    };
    Game.prototype.time_display = function(b) {
      return this.time_factor_display = b;
    };
    Game.prototype.set_bindings = function() {
      var x, _ref, _results;
      _ref = this.actions;
      _results = [];
      for (x in _ref) {
        if (!__hasProp.call(_ref, x)) continue;
        _results.push(this.enable_binding(this.keys[x], this.actions[x]));
      }
      return _results;
    };
    Game.prototype.disable_player_bindings = function() {
      var x, y, _ref, _results;
      _ref = this.actions;
      _results = [];
      for (y in _ref) {
        if (!__hasProp.call(_ref, y)) continue;
        _results.push((function() {
          var _i, _len, _ref, _results;
          if (y !== 'pause' && y !== 'mute') {
            _ref = this.keys[y];
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              x = _ref[_i];
              _results.push(this.bindings.disable(x));
            }
            return _results;
          }
        }).call(this));
      }
      return _results;
    };
    Game.prototype.enable_binding = function(keys, action) {
      var k, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = keys.length; _i < _len; _i++) {
        k = keys[_i];
        _results.push(this.bindings.enable.apply(this.bindings, [k].concat(action)));
      }
      return _results;
    };
    Game.prototype.switch_pause = function() {
      this.pause = !this.pause;
      if (this.pause) {
        return this.disable_player_bindings();
      } else {
        return this.set_bindings();
      }
    };
    Game.prototype.create_some_obstacles = function(count) {
      var i, obj, x, y, _results;
      _results = [];
      for (i = 0; (0 <= count ? i < count : i > count); (0 <= count ? i += 1 : i -= 1)) {
        obj = new Obstacle(this.world);
        x = this.width + 10;
        y = this.height * Math.random();
        _results.push(obj.movement.pos.Set(x, y));
      }
      return _results;
    };
    Game.prototype.create_spawner = function() {
      return new Timer(this.world, 0.4, __bind(function() {
        if (Math.random() < 0.2) {
          this.create_some_enemies(1 + 2 * Math.random());
        }
        if (Math.random() < 0.3) {
          return this.create_some_obstacles(1 + 3 * Math.random());
        }
      }, this));
    };
    Game.prototype.create_some_enemies = function(count) {
      var i, m, obj, x, y, _results;
      _results = [];
      for (i = 0; (0 <= count ? i < count : i > count); (0 <= count ? i += 1 : i -= 1)) {
        obj = new DumbUnit(this.world);
        m = obj.movement;
        x = this.width + 10;
        y = this.height * Math.random();
        obj.damage.groups.push("enemy");
        obj.shooting.shell_group = "enemy";
        m.pos.Set(x + m.size.x, y);
        m.vel.Set(-100 + 40 * Math.random(), 0);
        m.vel_want.SetV(m.vel);
        _results.push(Math.random() < 0.5 ? obj.random_movement = true : void 0);
      }
      return _results;
    };
    Game.prototype.create_player = function() {
      var die, player, x, y;
      player = new DumbUnit(this.world);
      x = this.width * Math.random();
      y = this.height * Math.random();
      player.damage.regenerate = 0.3;
      player.keep_in_field = true;
      player.shooting.auto_shoot = false;
      player.shooting.recharge_time = 0.05;
      player.shooting.shell_vel.Set(1200, 0);
      player.damage.groups.push("player");
      player.shooting.shell_group = "player";
      player.movement.pos.Set(x, y);
      player.show_energy = true;
      die = player.damage.die;
      player.damage.die = __bind(function(other) {
        die(other);
        return this.game_over = true;
      }, this);
      return player;
    };
    Game.prototype.create_world = function() {
      var field, world;
      field = [0, 0, this.width, this.height];
      world = new World(field);
      return world;
    };
    Game.prototype.collision_handler = function(dt, coll) {
      var _ref, _ref2;
      if ((_ref = coll.a.obj) != null) {
        if (typeof _ref.collide == "function") {
          _ref.collide(dt, coll.b, coll);
        }
      }
      return (_ref2 = coll.b.obj) != null ? typeof _ref2.collide == "function" ? _ref2.collide(dt, coll.a, coll) : void 0 : void 0;
    };
    Game.prototype.step = function(dt) {
      var chandler, collision, collisions, _i, _len;
      if (this.pause) {
        return;
      }
      chandler = this.collision_handler;
      collisions = this.world.get_collisions();
      for (_i = 0, _len = collisions.length; _i < _len; _i++) {
        collision = collisions[_i];
        chandler(dt, collision);
      }
      return this.world.step(dt);
    };
    Game.prototype.draw = function(ctx) {
      var big_font, ch, cw, normal_font, score, tf;
      ({
        create_style: function() {}
      });
      normal_font = function(ctx) {
        return ctx.font = "1em VT323";
      };
      big_font = function(ctx) {
        return ctx.font = "5em VT323";
      };
      ctx.save();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "gray";
      this.world.draw_objs();
      this.world.draw_shapes(ctx);
      score = Math.round(this.world.score);
      score = this.texts.score(score);
      ctx.save();
      normal_font(ctx);
      ctx.fillText(score, 6, 15);
      ctx.restore();
      if (this.time_factor_display) {
        tf = this.texts.time_factor_display(this.time_factor);
        ctx.save();
        normal_font(ctx);
        ctx.fillText(tf, 6, 40);
        ctx.restore();
      }
      if (this.game_over) {
        ctx.save();
        cw = this.width / 2;
        ch = this.height / 2;
        ctx.translate(cw, ch);
        ctx.textAlign = "center";
        ctx.save();
        normal_font(ctx);
        ctx.fillText(this.texts.reload, 0, 22);
        ctx.restore();
        ctx.save();
        big_font(ctx);
        ctx.fillText(this.texts.game_over, 0, 0);
        ctx.restore();
        ctx.restore();
      }
      return ctx.restore();
    };
    return Game;
  })();
}).call(this);
