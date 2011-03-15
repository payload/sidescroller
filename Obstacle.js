include("b2Vec2.js");

+function() {
    this.FlyingObject = function(){};
    var proto = FlyingObject.prototype;
    
    proto.init = function(world) {
        this.world = world;
        this.movement = new MovementModel();
        this.damage = new DamageModel();
        this.sprite = new Rectangle(world, this.movement);
        this.sprite.obj = this;
        this.keep_in_field = false;
        this.remove_when_out_of_sight = true;
        this.world.add_obj(this);
    };
    
    proto.collide = function(dt, other, coll) {
        var obj = other.obj;
        if (obj && 'damage' in obj)
            return this.damage.collide(dt, obj.damage, coll);
        return false;
    };
    
    proto.step = function(dt, veladd) {
        this.movement.step(dt, veladd);
        if (this.remove_when_out_of_sight)
            if (this.out_of_sight())
                this.remove();
        if (this.keep_in_field)
            this.set_pos_to_field();
    };
    
    proto.remove = function() {
        this.world.remove_obj(this);
        this.sprite.remove();
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

}();

+function() {
    var Obstacle = function(world) {
        this.init(world);
        this.movement.size.Set(10, 10);
        var dmg = this.damage;
        dmg.energy = 0;
        dmg.to_apply = 30;
        dmg.factor = 0;
        dmg.die = function(){};
    };
    this.Obstacle = inherit(Obstacle, FlyingObject);
}();
