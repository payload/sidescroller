window.DumbUnit = class DumbUnit extends FlyingObject
    constructor: (@world) ->
        super(world)
        @movement.size.Set(20, 20)
        
        @move_up = false
        @move_down = false
        @move_left = false
        @move_right = false
        
        @normsize = null
        @shooting = new ShootingModel(world)
        @random_movement = false
        
        dmg = @damage
        dmg.energy = 10
        dmg.max_energy = 10
        dmg.to_apply = 20
        dmg.factor = 1
        dmg.die = => @remove()
    
    collide: (dt, other, coll) ->
        if super(dt, other, coll)
            @movement.rot[0] += (Math.random() - Math.random())
    
    move_up_on: (dt) -> @move_up = true
    move_up_off: (dt) -> @move_up = false
    move_down_on: (dt) -> @move_down = true
    move_down_off: (dt) -> @move_down = false
    move_left_on: (dt) -> @move_left = true
    move_left_off: (dt) -> @move_left = false
    move_right_on: (dt) -> @move_right = true
    move_right_off: (dt) -> @move_right = false
    
    shoot_on: ->
        @normsize = @movement.size.Copy() if @normsize is null
    
    shoot_off: ->
        if @normsize
            @movement.size.SetV(@normsize)
            @normsize = null
    
    shoot: (dt) ->
        if @normsize != null
            shake = @normsize.Copy()
            shake.Multiply(1 + 0.3 * (Math.random() - Math.random()))
            @movement.size.SetV(shake)
        @shooting.shoot(dt, @movement)
    
    step: (dt) ->
        if @random_movement
            @move_up    = !@move_up    if Math.random() < 0.1
            @move_down  = !@move_down  if Math.random() < 0.1
            @move_left  = !@move_left  if Math.random() < 0.1
            @move_right = !@move_right if Math.random() < 0.1
    
        polar = b2Vec2.Polar
        pi = 3.14159
        velmax = @movement.vel_max[0]
        veladd = new b2Vec2(0, 0)
        veladd.AddPolar(pi * 1.5, velmax) if @move_up
        veladd.AddPolar(pi * 0.0, velmax) if @move_right
        veladd.AddPolar(pi * 0.5, velmax) if @move_down
        veladd.AddPolar(pi * 1.0, velmax) if @move_left
        
        super(dt, veladd)
        @shooting.step(dt, @movement)
