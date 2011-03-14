include("b2Vec2.js");

+function() {
    this.Obstacle = function(world) {
        if (!world) throw "world:World missing";
        this.world = world;
        
        this.movement = new MovementModel();
        this.movement.size.Set(10, 10);
        
        this.sprite = new Rectangle(world, this.movement);
        this.sprite.obj = this;
        
        this.damage = this.create_damage_model();
        
        this.world.add_obj(this);
    };
    var proto = Obstacle.prototype;
    
    proto.step = function(dt) {
        this.movement.step(dt);
        
        if (!this.world.in_field(this.movement.pos)) {
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
}();
