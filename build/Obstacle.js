(function() {
  var Obstacle;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  window.Obstacle = Obstacle = (function() {
    __extends(Obstacle, FlyingObject);
    function Obstacle(world) {
      var dmg, m;
      this.world = world;
      this.init(world);
      m = this.movement;
      dmg = this.damage;
      m.size.Set(10, 10);
      m.vel.Set(-160 + 40 * Math.random(), 0);
      m.vel_want.SetV(m.vel);
      dmg.energy = 0;
      dmg.to_apply = 30;
      dmg.factor = 0;
      dmg.die = function() {};
    }
    return Obstacle;
  })();
}).call(this);
