(function() {
  var FlyingObject;
  window.FlyingObject = FlyingObject = (function() {
    function FlyingObject(world) {
      this.world = world;
      this.movement = new MovementModel();
      this.damage = new DamageModel();
      this.sprite = new Rectangle(world, this);
      this.keep_in_field = false;
      this.remove_when_out_of_sight = true;
      this.removed = false;
      this.show_energy = false;
      this.world.add_obj(this);
    }
    FlyingObject.prototype.collide = function(dt, other, coll) {
      var obj;
      obj = other.obj;
      if (this.removed || !(obj != null) || obj.removed || !(obj.damage != null)) {
        return false;
      } else {
        return this.damage.collide(dt, obj.damage, coll);
      }
    };
    FlyingObject.prototype.step = function(dt, veladd) {
      if (this.removed) {
        return this.remove();
      }
      this.damage.step(dt);
      this.movement.step(dt, veladd);
      if (this.remove_when_out_of_sight && this.out_of_sight()) {
        this.remove();
      }
      if (this.keep_in_field) {
        return this.set_pos_to_field();
      }
    };
    FlyingObject.prototype.remove = function() {
      if (this.removed) {
        this.world.remove_obj(this);
        return this.sprite.remove();
      } else {
        return this.removed = true;
      }
    };
    FlyingObject.prototype.out_of_sight = function() {
      var br, field, m, pos, s, svec, tl;
      field = this.world.field;
      tl = new b2Vec2(field[0], field[1]);
      br = new b2Vec2(field[2], field[3]);
      m = this.movement;
      pos = m.pos;
      s = m.size.Length();
      svec = new b2Vec2(s, s);
      br.x *= 2;
      tl.Subtract(svec);
      br.Add(svec);
      return pos.x < tl.x || pos.x > br.x || pos.y < tl.y || pos.y > br.y;
    };
    FlyingObject.prototype.set_pos_to_field = function() {
      var br, field, m, pos, s, svec, tl, vel;
      field = this.world.field;
      tl = new b2Vec2(field[0], field[1]);
      br = new b2Vec2(field[2], field[3]);
      m = this.movement;
      pos = m.pos;
      vel = m.vel;
      s = m.size.Length();
      svec = new b2Vec2(s * 0.5, s * 0.5);
      tl.Add(svec);
      br.Subtract(svec);
      if (pos.x < tl.x) {
        pos.x = tl.x;
        vel.Set(0, vel.y);
      }
      if (pos.x > br.x) {
        pos.x = br.x;
        vel.Set(0, vel.y);
      }
      if (pos.y < tl.y) {
        pos.y = tl.y;
        vel.Set(vel.x, 0);
      }
      if (pos.y > br.y) {
        pos.y = br.y;
        return vel.Set(vel.x, 0);
      }
    };
    FlyingObject.prototype.draw = function() {
      var dmg, energy_ratio, style;
      if (this.show_energy) {
        style = this.sprite.style;
        dmg = this.damage;
        energy_ratio = dmg.energy / dmg.max_energy;
        style.fill = style.stroke.slice(0, 4);
        return style.fill[3] = energy_ratio;
      }
    };
    return FlyingObject;
  })();
}).call(this);
