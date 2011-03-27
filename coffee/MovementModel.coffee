window.MovementModel = class MovementModel
    constructor: ->
        @pos = new b2Vec2(0, 0)
        @size = new b2Vec2(10, 10)
        @rot = [0]
        
        @vel = new b2Vec2(0, 0)
        @vel_want = new b2Vec2(0, 0)
        @vel_max = [400]
        @accel = [3]

    step: (dt, veladd) ->
        vel = @vel
        vel_want = @vel_want
        vel_max = @vel_max[0]
        accel = @accel[0]
        diff = vel_want.Copy()
        diff.Add(veladd) if veladd?
        diff.Subtract(vel)
        diff.Multiply(Math.min(1, accel * dt))
        vel.Add(diff)
        if vel.Length() > vel_max
            vel.Normalize()
            vel.Multiply(vel_max)
    
        veldt = @vel.Copy()
        veldt.Multiply(dt)
        @pos.Add(veldt)


