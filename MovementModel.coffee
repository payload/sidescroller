window.MovementModel = class MovementModel
    constructor: ->
        this.pos = new b2Vec2(0, 0)
        this.size = new b2Vec2(10, 10)
        this.rot = [0]
        
        this.vel = new b2Vec2(0, 0)
        this.vel_want = new b2Vec2(0, 0)
        this.vel_max = [400]
        this.accel = [3]

    step: (dt, veladd) ->
        vel = this.vel
        vel_want = this.vel_want
        vel_max = this.vel_max[0]
        accel = this.accel[0]
        diff = vel_want.Copy()
        diff.Add(veladd) if veladd?
        diff.Subtract(vel)
        diff.Multiply(Math.min(1, accel * dt))
        vel.Add(diff)
        if vel.Length() > vel_max
            vel.Normalize()
            vel.Multiply(vel_max)
    
        veldt = this.vel.Copy()
        veldt.Multiply(dt)
        this.pos.Add(veldt)


