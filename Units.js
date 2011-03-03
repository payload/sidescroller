//include("Bullet.js");
include("b2Vec2.js");
include("Sprites.js");
include("Obstacle.js");

(function() {
    this.DumbUnit = function(world) {
        if (!world) throw "world:World missing";
        this.world = world;
        this.pos = new b2Vec2(0, 0);
        this.size = new b2Vec2(20, 20);
        this.rot = [0];
        this.vel = new b2Vec2(0, 0);
        this.accel = 2;
        this.vel_want = new b2Vec2(0, 0);
        var vel_max = 400;
        this.vel_up     = new b2Vec2(0, -vel_max);
        this.vel_down   = new b2Vec2(0,  vel_max);
        this.vel_left   = new b2Vec2(-vel_max, 0);
        this.vel_right  = new b2Vec2( vel_max, 0);
        this.sprite = new Rectangle(world, this.pos, this.size, this.rot);
        this.sprite.obj = this;
        this.world.add_obj(this);
        
        this.normsize = null;
        this.isUnit = true;
        this.notRecharged = 0;
        this.rechargeTime = 0.05;
        this.keep_in_field = false;
    };
    var proto = DumbUnit.prototype;
    
    proto.move_up_on = function(dt) {
        this.vel_want.Add(this.vel_up);
    };
    
    proto.move_up_off = function(dt) {
        this.vel_want.Subtract(this.vel_up);
    };
    
    proto.move_down_on = function(dt) {
        this.vel_want.Add(this.vel_down);
    };
    
    proto.move_down_off = function(dt) {
        this.vel_want.Subtract(this.vel_down);
    };
    
    proto.move_left_on = function(dt) {
        this.vel_want.Add(this.vel_left);
    };
    
    proto.move_left_off = function(dt) {
        this.vel_want.Subtract(this.vel_left);
    };
    
    proto.move_right_on = function(dt) {
        this.vel_want.Add(this.vel_right);
    };
    
    proto.move_right_off = function(dt) {
        this.vel_want.Subtract(this.vel_right);
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
        
        if (!this.notRecharged) {
            this.notRecharged = this.rechargeTime;
            
            var x = this.pos.x,
                y = this.pos.y,
                sx = this.size.x,
                vx = this.vel.x,
                vy = this.vel.y,
                shell = new Shell(this.world);
            shell.pos.Set(x + sx, y);
            shell.vel.Set(vx + 1200, vy);
        }
    };
    
    proto.step = function(dt) {    
        var diff = this.vel_want.Copy();
        diff.Subtract(this.vel);
        diff.Multiply(Math.min(1, this.accel * dt));
        this.vel.Add(diff);
    
        var vel = this.vel.Copy();
        vel.Multiply(dt);
        this.pos.Add(vel);
        
        if (this.keep_in_field)
            this.set_pos_to_field();
        
        this.notRecharged = Math.max(0, this.notRecharged - dt);
    };
    
    proto.set_pos_to_field = function() {
        var field = this.world.field,
            tl = new b2Vec2(field[0], field[1]),
            br = new b2Vec2(field[2], field[3]),
            pos = this.pos,
            vel = this.vel,
            s = this.size.Length(),
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
    }
    
    proto.collide = function(dt) {
        this.rot[0] += (Math.random() - Math.random());
    };
    
    proto.draw = function(ctx) {
    };
    
    proto.remove = function() {
        this.world.remove_obj(this);
        this.sprite.remove();
    };
})();

(function() {
    this.Shell = function(world, pos, size, vel) {
        if (!world) throw "world:World missing";
        this.world = world;
        this.pos = pos || new b2Vec2(0, 0);
        this.size = size || new b2Vec2(5, 5);
        this.rot = [0];
        this.vel = vel || new b2Vec2(0, 0);
        this.sprite = new Rectangle(world, this.pos, this.size, this.rot);
        this.sprite.obj = this;
        this.world.add_obj(this);
    };
    var proto = Shell.prototype;
    
    proto.step = function(dt) {
        var vel = this.vel.Copy();
        vel.Multiply(dt);
        this.pos.Add(vel);
        
        if (!this.world.in_field(this.pos)) {
            this.remove();
        }
    };
    
    proto.collide = function(other, coll) {
        var obj = other.obj;
        if (obj && "energy" in obj)
            ;
        this.remove();
    };
    
    proto.remove = function() {
        this.world.remove_obj(this);
        this.sprite.remove();
    };
})();
