window.ShootingModel = class ShootingModel
    constructor: (@world) ->
        this.recharge_time = 2
        this.not_recharged = this.recharge_time * Math.random()
        this.auto_shoot = true
        this.shell_vel = new b2Vec2(-400, 0)
        this.shell_group = null

    create_shell: (pos, vel) ->    
        shell = new Shell(this.world)
        shell.movement.pos.SetV(pos)
        shell.movement.vel.SetV(vel)
        shell.movement.vel_want.SetV(vel)
        shell.movement.vel_max[0] = vel.Length()
        shell.damage.groups.push(this.shell_group) if this.shell_group != null
        shell
    
    shoot: (dt, movement) ->
        if not this.not_recharged
            this.not_recharged = this.recharge_time
            m = movement
            pos = this.shell_vel.Copy()
            vel = this.shell_vel.Copy()
            pos.Normalize()
            pos.Multiply(m.size.Length())
            pos.Add(m.pos)
            vel.Add(m.vel)
            this.create_shell(pos, vel)
        else
            null

    step: (dt, movement) ->    
        this.not_recharged = Math.max(0, this.not_recharged - dt)
        this.shoot(dt, movement) if this.auto_shoot


