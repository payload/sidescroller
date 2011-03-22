(function() {
  var Game;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  window.Game = Game = (function() {
    function Game(canvas, bindings) {
      this.canvas = canvas;
      this.bindings = bindings;
      this.width = this.canvas.width;
      this.height = this.canvas.height;
      this.world = this.create_world();
      this.player = this.create_player();
      this.create_spawner();
      this.pause = false;
      this.game_over = false;
      this.keys = {
        up: [87, 75, 38],
        left: [65, 72, 37],
        down: [83, 74, 40],
        right: [68, 76, 39],
        shoot: [16, 32],
        pause: [80]
      };
      this.set_bindings();
    }
    Game.prototype.disable_player_bindings = function() {
      var action, all_keys, k, keys, _i, _j, _len, _len2, _results;
      keys = this.keys;
      all_keys = [];
      for (_i = 0, _len = keys.length; _i < _len; _i++) {
        action = keys[_i];
        all_keys = all_keys.concat(action);
      }
      _results = [];
      for (_j = 0, _len2 = all_keys.length; _j < _len2; _j++) {
        k = all_keys[_j];
        _results.push(this.bindings.disable(x));
      }
      return _results;
    };
    Game.prototype.set_bindings = function() {
      var bindings, down, k, keys, left, player, right, that, up, _i, _j, _k, _l, _len, _len2, _len3, _len4, _len5, _len6, _m, _n, _ref, _ref2, _ref3, _ref4, _ref5, _ref6, _results;
      that = this;
      bindings = this.bindings;
      player = this.player;
      keys = this.keys;
      up = [
        function(dt) {
          return player.move_up_on(dt);
        }, function(dt) {
          return player.move_up_off(dt);
        }, null
      ];
      left = [
        function(dt) {
          return player.move_left_on(dt);
        }, function(dt) {
          return player.move_left_off(dt);
        }, null
      ];
      down = [
        function(dt) {
          return player.move_down_on(dt);
        }, function(dt) {
          return player.move_down_off(dt);
        }, null
      ];
      right = [
        function(dt) {
          return player.move_right_on(dt);
        }, function(dt) {
          return player.move_right_off(dt);
        }, null
      ];
      _ref = keys.pause;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        k = _ref[_i];
        bindings.enable(k, null, function() {
          return that.switch_pause();
        }, null);
      }
      _ref2 = keys.up;
      for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
        k = _ref2[_j];
        bindings.enable.apply(bindings, [k].concat(up));
      }
      _ref3 = keys.left;
      for (_k = 0, _len3 = _ref3.length; _k < _len3; _k++) {
        k = _ref3[_k];
        bindings.enable.apply(bindings, [k].concat(left));
      }
      _ref4 = keys.down;
      for (_l = 0, _len4 = _ref4.length; _l < _len4; _l++) {
        k = _ref4[_l];
        bindings.enable.apply(bindings, [k].concat(down));
      }
      _ref5 = keys.right;
      for (_m = 0, _len5 = _ref5.length; _m < _len5; _m++) {
        k = _ref5[_m];
        bindings.enable.apply(bindings, [k].concat(right));
      }
      _ref6 = keys.shoot;
      _results = [];
      for (_n = 0, _len6 = _ref6.length; _n < _len6; _n++) {
        k = _ref6[_n];
        _results.push(bindings.enable(k, function() {
          return player.shoot_on();
        }, function() {
          return player.shoot_off();
        }, function(dt) {
          return player.shoot(dt);
        }));
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
      var height, i, obj, width, world, x, y, _results;
      world = this.world;
      width = this.width;
      height = this.height;
      _results = [];
      for (i = 0; (0 <= count ? i < count : i > count); (0 <= count ? i += 1 : i -= 1)) {
        obj = new Obstacle(world);
        x = width + 10;
        y = height * Math.random();
        _results.push(obj.movement.pos.Set(x, y));
      }
      return _results;
    };
    Game.prototype.create_spawner = function() {
      var t;
      return t = new window.Timer(this.world, 0.4, __bind(function() {
        if (Math.random() < 0.2) {
          this.create_some_enemies(1 + 2 * Math.random());
        }
        if (Math.random() < 0.3) {
          return this.create_some_obstacles(1 + 3 * Math.random());
        }
      }, this));
    };
    Game.prototype.create_some_enemies = function(count) {
      var height, i, m, obj, width, world, x, y, _results;
      world = this.world;
      width = this.width;
      height = this.height;
      _results = [];
      for (i = 0; (0 <= count ? i < count : i > count); (0 <= count ? i += 1 : i -= 1)) {
        obj = new DumbUnit(world);
        m = obj.movement;
        x = width + 10;
        y = height * Math.random();
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
      var die, height, player, width, world, x, y;
      world = this.world;
      width = this.width;
      height = this.height;
      player = new DumbUnit(world);
      x = width * Math.random();
      y = height * Math.random();
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
      world = new window.World(field);
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
      var score;
      this.world.draw_objs();
      ctx.save();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "gray";
      this.world.draw_shapes(ctx);
      score = this.world.score;
      score = score === 1 ? "" + score + " point" : "" + score + " points";
      ctx.font = "1em VT323";
      ctx.fillText(score, 10, 15);
      if (this.game_over) {
        ctx.font = "5em VT323";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", 320, 240);
        ctx.font = "1em VT323";
        ctx.fillText("Reload with F5 or Ctrl+R to play it again!", 320, 262);
      }
      return ctx.restore();
    };
    return Game;
  })();
}).call(this);
