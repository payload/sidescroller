//include("Bullet.js");
include("b2Vec2.js");
include("Sprites.js");

(function() {
    this.Enemy = function(world, pos, size, rot, vel) {
        if (!world) throw "world:World missing";
        this.world = world;
        this.pos = pos || new b2Vec2(0, 0);
        this.size = size || new b2Vec2(0.25, 0.25);
        this.rot = rot || [0];
        this.vel = vel || new b2Vec2(-1, 0);
        this.sprite = new Rectangle(world, this.pos, this.size, this.rot);
        this.sprite.obj = this;
        this.world.add_obj(this);
    };
    var proto = Enemy.prototype;
    
    proto.step = function(dt) {
        var vel = this.vel.Copy();
        vel.Multiply(dt);
        this.pos.Add(vel);
    };
})();
