//include("Bullet.js");
include("b2Vec2.js");
include("Sprites.js");

(function() {
    this.Player = function(world, pos, rot) {
        if (!world) throw "world:World missing";
        this.world = world;
        this.pos = pos || new b2Vec2(0, 0);
        this.rot = rot || 0;
        this.radius = [0.15];
        this.move_vert = new b2Vec2(0, 0.04);
        this.move_hori = new b2Vec2(0.04, 0);
        this.sprite = new Circle(world, this.pos, this.radius);
        this.sprite.obj = this;
        this.world.add_obj(this);
    };
    
    Player.prototype.move_up = function() {
        this.pos.Subtract(this.move_vert);
    };
    
    Player.prototype.move_down = function() {
        this.pos.Add(this.move_vert);
    };
    
    Player.prototype.move_left = function() {
        this.pos.Subtract(this.move_hori);
    };
    
    Player.prototype.move_right = function() {
        this.pos.Add(this.move_hori);
    };
    
    Player.prototype.shoot = function() {
        this.radius[0] *= 11/10;  
    };
    
    Player.prototype.step = function() {
        if (this.radius[0] > 0.15)
            this.radius[0] *= 11/12;
    };
    
    Player.prototype.draw = function(ctx) {
    };
})();
