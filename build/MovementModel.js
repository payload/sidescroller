(function() {
  var MovementModel;
  window.MovementModel = MovementModel = (function() {
    function MovementModel() {
      this.pos = new b2Vec2(0, 0);
      this.size = new b2Vec2(10, 10);
      this.rot = [0];
      this.vel = new b2Vec2(0, 0);
      this.vel_want = new b2Vec2(0, 0);
      this.vel_max = [400];
      this.accel = [3];
    }
    MovementModel.prototype.step = function(dt, veladd) {
      var accel, diff, vel, vel_max, vel_want, veldt;
      vel = this.vel;
      vel_want = this.vel_want;
      vel_max = this.vel_max[0];
      accel = this.accel[0];
      diff = vel_want.Copy();
      if (veladd != null) {
        diff.Add(veladd);
      }
      diff.Subtract(vel);
      diff.Multiply(Math.min(1, accel * dt));
      vel.Add(diff);
      if (vel.Length() > vel_max) {
        vel.Normalize();
        vel.Multiply(vel_max);
      }
      veldt = this.vel.Copy();
      veldt.Multiply(dt);
      return this.pos.Add(veldt);
    };
    return MovementModel;
  })();
}).call(this);
