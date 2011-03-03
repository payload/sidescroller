//include("Bullet.js");
include("b2Vec2.js");
include("Sprites.js");

(function() {
    this.DumbUnit = function(world) {
        if (!world) throw "world:World missing";
        this.world = world;
        this.pos = new b2Vec2(0, 0);
        this.size = new b2Vec2(20, 20);
        this.rot = [0];
        this.vel = new b2Vec2(0, 0);
        var speed = 400;
        this.move_vert = new b2Vec2(0, speed);
        this.move_hori = new b2Vec2(speed, 0);
        this.sprite = new Rectangle(world, this.pos, this.size, this.rot);
        this.sprite.obj = this;
        this.world.add_obj(this);
        
        this.normsize = null;
        this.isUnit = true;
    };
    var proto = DumbUnit.prototype;
    
    proto.move_up = function(dt) {
        var vel = this.move_vert.Copy();
        vel.Multiply(dt);
        this.pos.Subtract(vel);
    };
    
    proto.move_down = function(dt) {
        var vel = this.move_vert.Copy();
        vel.Multiply(dt);
        this.pos.Add(vel);
    };
    
    proto.move_left = function(dt) {
        var vel = this.move_hori.Copy();
        vel.Multiply(dt);
        this.pos.Subtract(vel);
    };
    
    proto.move_right = function(dt) {
        var vel = this.move_hori.Copy();
        vel.Multiply(dt);
        this.pos.Add(vel);
    };
    
    proto.shoot_on = function() {
        if (this.normsize) return;
        this.normsize = this.size.Copy();
    };
    
    proto.shoot_off = function() {
        if (!this.normsize) return;
        this.size.SetV(this.normsize);
        this.normsize = null;
    };
    
    proto.shoot = function(dt) {
        var shake = this.normsize.Copy();
        shake.Multiply(1 + 0.3 * (Math.random() - Math.random()));
        this.size.SetV(shake);
    };
    
    proto.step = function(dt) {
        var vel = this.vel.Copy();
        vel.Multiply(dt);
        this.pos.Add(vel);
    };
    
    proto.collide = function(dt) {
        this.rot[0] += (Math.random() - Math.random());
    };
    
    proto.draw = function(ctx) {
    };
})();
