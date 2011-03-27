window.ShootingModel = class ShootingModel
    constructor: (@world) ->
        @recharge_time = 2
        @not_recharged = @recharge_time * Math.random()
        @auto_shoot = true
        @shell_vel = new b2Vec2(-400, 0)
        @shell_group = null

    create_shell: (pos, vel) ->    
        shell = new Shell(@world)
        shell.movement.pos.SetV(pos)
        shell.movement.vel.SetV(vel)
        shell.movement.vel_want.SetV(vel)
        shell.movement.vel_max[0] = vel.Length()
        shell.damage.groups.push(@shell_group) if @shell_group != null
        shell
    
    shoot: (dt, movement) ->
        if not @not_recharged
            @not_recharged = @recharge_time
            m = movement
            pos = @shell_vel.Copy()
            vel = @shell_vel.Copy()
            pos.Normalize()
            pos.Multiply(m.size.Length())
            pos.Add(m.pos)
            vel.Add(m.vel)
            @create_shell(pos, vel)
        else
            null

    step: (dt, movement) ->    
        @not_recharged = Math.max(0, @not_recharged - dt)
        @shoot(dt, movement) if @auto_shoot


