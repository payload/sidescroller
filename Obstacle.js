include("b2Vec2.js");

(function() {
    this.Obstacle = function(world, pos, size, rot) {
        if (!world) throw "world:World missing";
        this.world = world;
        
        this.pos = pos || new b2Vec2(0, 0);
        this.size = size || new b2Vec2(10, 10);
        this.rot = rot || [0];        
        this.vel = new b2Vec2(0, 0);
        
        this.sprite = new Rectangle(world, this.pos, this.size, this.rot);
        this.sprite.obj = this;
        
        this.damage = this.create_damage_model();
        
        this.world.add_obj(this);
    };
    var proto = Obstacle.prototype;
    
    proto.step = function(dt) {
        var vel = this.vel.Copy();
        vel.Multiply(dt);
        this.pos.Add(vel);
        
        if (!this.world.in_field(this.pos)) {
            this.remove();
        }
    };
    
    proto.create_damage_model = function() {
        var dmg = new DamageModel();
        dmg.energy = 0;
        dmg.to_apply = 30;
        dmg.factor = 0;
        dmg.die = function(){};
        return dmg;
    };
    
    proto.collide = function(dt, other, coll) {
        var obj = other.obj;
        if (obj && 'damage' in obj) 
            this.damage.collide(dt, obj.damage, coll);
    };
})();
