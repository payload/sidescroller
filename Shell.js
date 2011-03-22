(function() {
  var Shell;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __indexOf = Array.prototype.indexOf || function(item) {
    for (var i = 0, l = this.length; i < l; i++) {
      if (this[i] === item) return i;
    }
    return -1;
  };
  window.Shell = Shell = (function() {
    __extends(Shell, FlyingObject);
    function Shell(world) {
      var that;
      this.world = world;
      this.init(world);
      this.movement.size.Set(5, 5);
      that = this;
      this.damage.die = function(other) {
        var player_hits_enemy;
        player_hits_enemy = __indexOf.call(this.groups, 'player') >= 0 && __indexOf.call(other.groups, 'enemy') >= 0;
        if (player_hits_enemy) {
          that.world.inc_score();
        }
        that.remove();
        return this.explode(other, 1);
      };
    }
    return Shell;
  })();
}).call(this);
