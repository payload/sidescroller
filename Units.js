//include("Bullet.js");
include("b2Vec2.js");
include("Sprites.js");
include("Obstacle.js");
include("ShootingModel.js");

+function() {
    this.DamageModel = function(){
        this.energy = 0;
        this.factor = 1;
        this.to_apply = 0;
        this.die = function(){};
    };
    var proto = DamageModel.prototype;
    
    proto.apply_damage = function(dt, dmg, to_apply) {
        dmg.energy -= to_apply * dmg.factor * dt;
        if (dmg.energy < 0)
            dmg.die(this);
    };
    
    proto.collide = function(dt, dmg, coll) {
        this.apply_damage(dt, dmg, this.to_apply);
    };
    
    proto.explode = function(other, damage) {
        this.apply_damage(1, other, damage);
    };
}();

+function() {
    this.MovementModel = function(){
        this.pos = new b2Vec2(0, 0);
        this.size = new b2Vec2(10, 10);
        this.rot = [0];
        
        this.vel = new b2Vec2(0, 0);
        this.vel_want = new b2Vec2(0, 0);
        this.vel_max = [400];
        this.accel = [2];
    };
    var proto = MovementModel.prototype;
    
    proto.step = function(dt, veladd) {
        var vel = this.vel,
            vel_want = this.vel_want,
            vel_max = this.vel_max[0],
            accel = this.accel[0],
            diff = vel_want.Copy();
        if (veladd !== undefined)
            diff.Add(veladd);
        diff.Subtract(vel);
        diff.Multiply(Math.min(1, accel * dt));
        vel.Add(diff);
        if (vel.Length() > vel_max) {
            vel.Normalize();
            vel.Multiply(vel_max);
        }
    
        var veldt = this.vel.Copy();
        veldt.Multiply(dt);
        this.pos.Add(veldt);
    };
}();

+function() {
    var DumbUnit = function(world) {
        this.init(world);
        this.movement.size.Set(20, 20);
        
        this.move_up = false;
        this.move_down = false;
        this.move_left = false;
        this.move_right = false;
        
        this.normsize = null;
        this.shooting = new ShootingModel(world);
        
        var dmg = this.damage,
            that = this;
        dmg.energy = 10;
        dmg.to_apply = 20;
        dmg.factor = 1;
        dmg.die = function() {
            that.remove();
        };
    };
    this.DumbUnit = inherit(DumbUnit, FlyingObject);
    var proto = DumbUnit.prototype;
    
    var super_collide = proto.collide;
    proto.collide = function(dt, other, coll) {
        super_collide.apply(this, arguments);
        this.movement.rot[0] += (Math.random() - Math.random());
    };
    
    proto.move_up_on = function(dt) {
        this.move_up = true;
    };
    
    proto.move_up_off = function(dt) {
        this.move_up = false;
    };
    
    proto.move_down_on = function(dt) {
        this.move_down = true;
    };
    
    proto.move_down_off = function(dt) {
        this.move_down = false;
    };
    
    proto.move_left_on = function(dt) {
        this.move_left = true;
    };
    
    proto.move_left_off = function(dt) {
        this.move_left = false;
    };
    
    proto.move_right_on = function(dt) {
        this.move_right = true;
    };
    
    proto.move_right_off = function(dt) {
        this.move_right = false;
    };
    
    proto.shoot_on = function() {
        if (this.normsize) return;
        this.normsize = this.movement.size.Copy();
    };
    
    proto.shoot_off = function() {
        if (!this.normsize) return;
        this.movement.size.SetV(this.normsize);
        this.normsize = null;
    };
    
    proto.shoot = function(dt) {
        if (this.normsize !== null) {
            var shake = this.normsize.Copy();
            shake.Multiply(1 + 0.3 * (Math.random() - Math.random()));
            this.movement.size.SetV(shake);
        }
        this.shooting.shoot(dt, this.movement);
    };
    
    var super_step = proto.step;
    proto.step = function(dt) {
        var polar = b2Vec2.Polar,
            pi = 3.14159,
            velmax = this.movement.vel_max[0],
            veladd = new b2Vec2(0, 0);
        if (this.move_up)
            veladd.AddPolar(pi * 1.5, velmax);
        if (this.move_right)
            veladd.AddPolar(pi * 0.0, velmax);
        if (this.move_down)
            veladd.AddPolar(pi * 0.5, velmax);
        if (this.move_left)
            veladd.AddPolar(pi * 1.0, velmax);
        
        super_step.call(this, dt, veladd);
        this.shooting.step(dt, this.movement);
    };
}();

+function() {
    var Shell = function(world) {
        var that = this;
        this.init(world);
        this.movement.size.Set(5, 5);
        this.damage.die = function(other) {
            that.remove();
            this.explode(other, 1);
        };
    };
    this.Shell = inherit(Shell, FlyingObject);
}();
