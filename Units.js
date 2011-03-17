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
        this.random_movement = false;
        
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
        if (super_collide.apply(this, arguments))
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
        if (this.random_movement) {
            if (Math.random() < 0.1) this.move_up = !this.move_up;
            if (Math.random() < 0.1) this.move_down = !this.move_down;
            if (Math.random() < 0.1) this.move_left = !this.move_left;
            if (Math.random() < 0.1) this.move_right = !this.move_right;
        }
    
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
