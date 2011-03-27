(function() {
  var DumbUnit;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  window.DumbUnit = DumbUnit = (function() {
    __extends(DumbUnit, FlyingObject);
    function DumbUnit(world) {
      var dmg;
      this.world = world;
      DumbUnit.__super__.constructor.call(this, world);
      this.movement.size.Set(20, 20);
      this.move_up = false;
      this.move_down = false;
      this.move_left = false;
      this.move_right = false;
      this.normsize = null;
      this.shooting = new ShootingModel(world);
      this.random_movement = false;
      dmg = this.damage;
      dmg.energy = 10;
      dmg.max_energy = 10;
      dmg.to_apply = 20;
      dmg.factor = 1;
      dmg.die = __bind(function() {
        return this.remove();
      }, this);
    }
    DumbUnit.prototype.collide = function(dt, other, coll) {
      if (DumbUnit.__super__.collide.call(this, dt, other, coll)) {
        return this.movement.rot[0] += Math.random() - Math.random();
      }
    };
    DumbUnit.prototype.move_up_on = function(dt) {
      return this.move_up = true;
    };
    DumbUnit.prototype.move_up_off = function(dt) {
      return this.move_up = false;
    };
    DumbUnit.prototype.move_down_on = function(dt) {
      return this.move_down = true;
    };
    DumbUnit.prototype.move_down_off = function(dt) {
      return this.move_down = false;
    };
    DumbUnit.prototype.move_left_on = function(dt) {
      return this.move_left = true;
    };
    DumbUnit.prototype.move_left_off = function(dt) {
      return this.move_left = false;
    };
    DumbUnit.prototype.move_right_on = function(dt) {
      return this.move_right = true;
    };
    DumbUnit.prototype.move_right_off = function(dt) {
      return this.move_right = false;
    };
    DumbUnit.prototype.shoot_on = function() {
      if (this.normsize === null) {
        return this.normsize = this.movement.size.Copy();
      }
    };
    DumbUnit.prototype.shoot_off = function() {
      if (this.normsize) {
        this.movement.size.SetV(this.normsize);
        return this.normsize = null;
      }
    };
    DumbUnit.prototype.shoot = function(dt) {
      var shake;
      if (this.normsize !== null) {
        shake = this.normsize.Copy();
        shake.Multiply(1 + 0.3 * (Math.random() - Math.random()));
        this.movement.size.SetV(shake);
      }
      return this.shooting.shoot(dt, this.movement);
    };
    DumbUnit.prototype.step = function(dt) {
      var pi, polar, veladd, velmax;
      if (this.random_movement) {
        if (Math.random() < 0.1) {
          this.move_up = !this.move_up;
        }
        if (Math.random() < 0.1) {
          this.move_down = !this.move_down;
        }
        if (Math.random() < 0.1) {
          this.move_left = !this.move_left;
        }
        if (Math.random() < 0.1) {
          this.move_right = !this.move_right;
        }
      }
      polar = b2Vec2.Polar;
      pi = 3.14159;
      velmax = this.movement.vel_max[0];
      veladd = new b2Vec2(0, 0);
      if (this.move_up) {
        veladd.AddPolar(pi * 1.5, velmax);
      }
      if (this.move_right) {
        veladd.AddPolar(pi * 0.0, velmax);
      }
      if (this.move_down) {
        veladd.AddPolar(pi * 0.5, velmax);
      }
      if (this.move_left) {
        veladd.AddPolar(pi * 1.0, velmax);
      }
      DumbUnit.__super__.step.call(this, dt, veladd);
      return this.shooting.step(dt, this.movement);
    };
    return DumbUnit;
  })();
}).call(this);
