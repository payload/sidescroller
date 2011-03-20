(function() {
  var World;
  window.World = World = (function() {
    function World(field) {
      this.field = field;
      this.objs = [];
      this.shapes = [];
      this.timers = [];
      this.collide = {
        rect_rect: this.collision_rect_rect
      };
    }
    World.prototype.in_field = function(vec) {
      var f;
      f = this.field;
      return vec.x > f[0] && vec.x < field[2] && vec.y > f[1] && vec.y < field[3];
    };
    World.prototype.collision_rect_rect = function(a, b) {
      var diff, distance, min_distance, posa, posb;
      posa = a.pos;
      posb = b.pos;
      diff = posb.Copy();
      diff.Subtract(posa);
      distance = diff.Length();
      min_distance = a.size.Length() * 0.5 + b.size.Length() * 0.5;
      if (distance < min_distance) {
        return {
          a: a,
          b: b,
          diff: diff,
          distance: distance,
          min_distance: min_distance
        };
      } else {
        return null;
      }
    };
    World.prototype.get_collisions = function() {
      var a, b, collide, collide_f, collision, collision_type, collisions, i, j, shapes, _ref, _ref2, _ref3, _ref4;
      collide = this.collide;
      shapes = this.shapes;
      collisions = [];
      for (i = 0, _ref = shapes.length; (0 <= _ref ? i < _ref : i > _ref); (0 <= _ref ? i += 1 : i -= 1)) {
        for (j = _ref2 = i + 1, _ref3 = shapes.length; (_ref2 <= _ref3 ? j < _ref3 : j > _ref3); (_ref2 <= _ref3 ? j += 1 : j -= 1)) {
          a = shapes[i];
          b = shapes[j];
          if (b.type < a.type) {
            _ref4 = [b, a], a = _ref4[0], b = _ref4[1];
          }
          collision_type = a.type + "_" + b.type;
          collide_f = collide[collision_type];
          collision = typeof collide_f == "function" ? collide_f(a, b) : void 0;
          if (collision != null) {
            collisions.push(collision);
          }
        }
      }
      return collisions;
    };
    World.prototype.add_obj = function(obj) {
      return this.objs.push(obj);
    };
    World.prototype.remove_obj = function(obj) {
      return this.objs.splice(this.objs.indexOf(obj), 1);
    };
    World.prototype.add_shape = function(obj) {
      return this.shapes.push(obj);
    };
    World.prototype.remove_shape = function(obj) {
      return this.shapes.splice(this.shapes.indexOf(obj), 1);
    };
    World.prototype.add_timer = function(obj) {
      return this.timers.push(obj);
    };
    World.prototype.remove_timer = function(obj) {
      return this.timers.splice(this.timers.indexOf(obj), 1);
    };
    World.prototype.step = function(dt) {
      var obj, timer, _i, _j, _len, _len2, _ref, _ref2, _results;
      _ref = this.timers;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        timer = _ref[_i];
        if (typeof timer.step == "function") {
          timer.step(dt);
        }
      }
      _ref2 = this.objs.slice(0, this.objs.length);
      _results = [];
      for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
        obj = _ref2[_j];
        _results.push(typeof obj.step == "function" ? obj.step(dt) : void 0);
      }
      return _results;
    };
    World.prototype.draw_objs = function() {
      var obj, _i, _len, _ref, _results;
      _ref = this.objs;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        obj = _ref[_i];
        _results.push(typeof obj.draw == "function" ? obj.draw() : void 0);
      }
      return _results;
    };
    World.prototype.draw_shapes = function(ctx) {
      var shape, _i, _len, _ref, _results;
      _ref = this.shapes;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        shape = _ref[_i];
        _results.push(typeof shape.draw == "function" ? shape.draw(ctx) : void 0);
      }
      return _results;
    };
    return World;
  })();
}).call(this);
