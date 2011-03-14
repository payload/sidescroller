//include("Bullet.js");
include("b2Vec2.js");
include("Sprites.js");
include("Obstacle.js");

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
    this.DumbUnit = function(world) {
        if (!world) throw "world:World missing";
        this.world = world;
        
        this.movement = new MovementModel();
        this.movement.size.Set(20, 20);
        
        this.move_up = false;
        this.move_down = false;
        this.move_left = false;
        this.move_right = false;
        
        this.normsize = null;
        this.isUnit = true;
        this.notRecharged = 0;
        this.rechargeTime = 0.05;
        this.keep_in_field = false;
        this.remove_when_out_of_sight = true;
        
        this.sprite = new Rectangle(world, this.movement);
        this.sprite.obj = this;
        
        this.damage = this.create_damage_model();
        
        this.world.add_obj(this);
    };
    var proto = DumbUnit.prototype;
    
    proto.create_damage_model = function() {
        var dmg = new DamageModel(),
            that = this;
        dmg.energy = 10;
        dmg.to_apply = 20;
        dmg.factor = 1;
        dmg.die = function() {
            that.remove();
        };
        return dmg;
    };
    
    proto.collide = function(dt, other, coll) {
        var obj = other.obj;
        if (obj && 'damage' in obj)
            this.damage.collide(dt, obj.damage, coll);
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
        var shake = this.normsize.Copy();
        shake.Multiply(1 + 0.3 * (Math.random() - Math.random()));
        this.movement.size.SetV(shake);
        
        if (!this.notRecharged) {
            this.notRecharged = this.rechargeTime;
            
            var m = this.movement,
                x = m.pos.x,
                y = m.pos.y,
                sx = m.size.x,
                vx = m.vel.x,
                vy = m.vel.y,
                shell = new Shell(this.world);
            shell.movement.pos.Set(x + sx, y);
            shell.movement.vel.Set(vx + 1200, vy);
            shell.movement.vel_want.SetV(shell.movement.vel);
            shell.movement.vel_max[0] = shell.movement.vel.Length();
        }
    };
    
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
        this.movement.step(dt, veladd);
        
        if (this.remove_when_out_of_sight)
            if (this.out_of_sight())
                this.remove();
        if (this.keep_in_field)
            this.set_pos_to_field();
        
        this.notRecharged = Math.max(0, this.notRecharged - dt);
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
    }
    
    proto.draw = function(ctx) {
    };
    
    proto.remove = function() {
        this.world.remove_obj(this);
        this.sprite.remove();
    };
}();

+function() {
    this.Shell = function(world) {
        if (!world) throw "world:World missing";
        this.world = world;
        
        this.movement = new MovementModel();
        this.movement.size.Set(5, 5);
        
        this.sprite = new Rectangle(world, this.movement);
        this.sprite.obj = this;
        
        this.damage = this.create_damage_model();
        
        this.world.add_obj(this);
    };
    var proto = Shell.prototype;
    
    proto.create_damage_model = function() {
        var dmg = new DamageModel(),
            that = this;
        dmg.die = function(other) {
            that.remove();
            this.explode(other, 1);
        };
        return dmg;
    };
    
    proto.collide = function(dt, other, coll) {
        var obj = other.obj;
        if (obj && 'damage' in obj)
            this.damage.collide(dt, obj.damage, coll);
    };
    
    proto.step = function(dt) {
        this.movement.step(dt);
        
        if (!this.world.in_field(this.movement.pos)) {
            this.remove();
        }
    };
    
    proto.remove = function() {
        this.world.remove_obj(this);
        this.sprite.remove();
    };
}();
