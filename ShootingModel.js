+function() {
    var ShootingModel = function(world) {
        this.world = world;
        this.recharge_time = 2;
        this.not_recharged = this.recharge_time * Math.random();
        this.auto_shoot = true;
        this.shell_vel = new b2Vec2(-400, 0);
        this.shell_group = null;
    };
    this.ShootingModel = ShootingModel;
    var proto = ShootingModel.prototype;
    
    proto.create_shell = function(pos, vel) {
        var shell = new Shell(this.world);
        shell.movement.pos.SetV(pos);
        shell.movement.vel.SetV(vel);
        shell.movement.vel_want.SetV(vel);
        shell.movement.vel_max[0] = vel.Length();
        if (this.shell_group !== null)
            shell.damage.groups.push(this.shell_group);
        return shell;
    };
    
    proto.shoot = function(dt, movement) {
        if (!this.not_recharged) {
            this.not_recharged = this.recharge_time;
            var m = movement,
                pos = this.shell_vel.Copy(),
                vel = this.shell_vel.Copy();
            pos.Normalize();
            pos.Multiply(m.size.Length());
            pos.Add(m.pos);
            vel.Add(m.vel);
            return this.create_shell(pos, vel);
        }
        return null;
    };
    
    proto.step = function(dt, movement) {
        this.not_recharged = Math.max(0, this.not_recharged - dt);
        if (this.auto_shoot)
            this.shoot(dt, movement);
    };
}();

