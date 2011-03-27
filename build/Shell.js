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
      var i, snd, that;
      this.world = world;
      Shell.__super__.constructor.call(this, world);
      this.movement.size.Set(5, 5);
      that = this;
      this.damage.die = function(other) {
        var player_hits_enemy;
        player_hits_enemy = __indexOf.call(this.groups, 'player') >= 0 && __indexOf.call(other.groups, 'enemy') >= 0;
        if (player_hits_enemy) {
          that.world.inc_score();
        }
        that.remove(player_hits_enemy);
        return this.explode(other, 1);
      };
      if (this.world.laser_sounds.length > 0) {
        i = this.world.laser_sound;
        while (true) {
          snd = this.world.laser_sounds[this.world.laser_sound];
          this.world.laser_sound = (this.world.laser_sound + 1) % this.world.laser_sounds.length;
          if (snd.ended || snd.paused) {
            if (snd.currentTime !== 0) {
              snd.currentTime = 0;
            }
            snd.play();
            break;
          }
          if (this.world.laser_sound === i) {
            break;
          }
        }
      }
    }
    Shell.prototype.remove = function(player_hits_enemy) {
      if (player_hits_enemy !== true && __indexOf.call(this.damage.groups, 'player') >= 0) {
        this.world.shell_miss();
      }
      return Shell.__super__.remove.call(this);
    };
    return Shell;
  })();
}).call(this);
