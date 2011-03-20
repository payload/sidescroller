+function() {
    this.FlyingObject = function(){};
    var proto = FlyingObject.prototype;
    
    proto.init = function(world) {
        this.world = world;
        this.movement = new MovementModel();
        this.damage = new window.DamageModel();
        this.sprite = new window.Rectangle(world, this);
        this.keep_in_field = false;
        this.remove_when_out_of_sight = true;
        this.removed = false;
        this.show_energy = false;
        this.world.add_obj(this);
    };
    
    proto.collide = function(dt, other, coll) {
        if (this.removed) return false;
        var obj = other.obj;
        if (obj && !obj.removed && 'damage' in obj)
            return this.damage.collide(dt, obj.damage, coll);
        return false;
    };
    
    proto.step = function(dt, veladd) {
        if (this.removed)
            return this.remove();
        this.damage.step(dt);
        this.movement.step(dt, veladd);
        if (this.remove_when_out_of_sight)
            if (this.out_of_sight())
                this.remove();
        if (this.keep_in_field)
            this.set_pos_to_field();
    };
    
    proto.remove = function() {
        if (this.removed) {
            this.world.remove_obj(this);
            this.sprite.remove();
        } else
            this.removed = true;
    };
    
    proto.out_of_sight = function() {
        var field = this.world.field,
            tl = new b2Vec2(field[0], field[1]),
            br = new b2Vec2(field[2], field[3]),
            m = this.movement,
            pos = m.pos,
            s = m.size.Length(),
            svec = new b2Vec2(s, s);
        br.x *= 2;
        tl.Subtract(svec);
        br.Add(svec);
        var out =
            pos.x < tl.x ||
            pos.x > br.x ||
            pos.y < tl.y ||
            pos.y > br.y;
        return out;
    };
    
    proto.set_pos_to_field = function() {
        var field = this.world.field,
            tl = new b2Vec2(field[0], field[1]),
            br = new b2Vec2(field[2], field[3]),
            m = this.movement,
            pos = m.pos,
            vel = m.vel,
            s = m.size.Length(),
            svec = new b2Vec2(s*0.5, s*0.5);
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
            vel.Set(vel.x, 0);
        }
    };
    
    proto.draw = function() {
        if (this.show_energy) {
            var style = this.sprite.style,
                dmg = this.damage,
                energy_ratio = dmg.energy / dmg.max_energy;
            style.fill = style.stroke.slice(0, 4);
            style.fill[3] = energy_ratio;
        }
    };

}();
