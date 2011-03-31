(function() {
  var DamageModel;
  var __indexOf = Array.prototype.indexOf || function(item) {
    for (var i = 0, l = this.length; i < l; i++) {
      if (this[i] === item) return i;
    }
    return -1;
  };
  window.DamageModel = DamageModel = (function() {
    function DamageModel() {
      this.energy = 0;
      this.max_energy = 0;
      this.factor = 1;
      this.to_apply = 0;
      this.regenerate = 0;
      this.groups = [];
      this.die = function() {};
    }
    DamageModel.prototype.step = function(dt) {
      if (this.regenerate === 0) {
        return;
      }
      if (this.energy < this.max_energy || this.regenerate < 0) {
        this.energy = Math.min(this.energy + this.regenerate * dt, this.max_energy);
        if (this.energy < 0) {
          return this.die();
        }
      }
    };
    DamageModel.prototype.check_group = function(a, b) {
      var g, _i, _len;
      for (_i = 0, _len = a.length; _i < _len; _i++) {
        g = a[_i];
        if (__indexOf.call(b, g) >= 0) {
          return true;
        }
      }
      return false;
    };
    DamageModel.prototype.apply_damage = function(dt, dmg, to_apply) {
      if (this.check_group(this.groups, dmg.groups)) {
        return false;
      }
      dmg.energy -= to_apply * dmg.factor * dt;
      if (dmg.energy < 0) {
        dmg.die(this);
      }
      return true;
    };
    DamageModel.prototype.collide = function(dt, dmg, coll) {
      return this.apply_damage(dt, dmg, this.to_apply);
    };
    DamageModel.prototype.explode = function(other, damage) {
      return this.apply_damage(1, other, damage);
    };
    return DamageModel;
  })();
}).call(this);
