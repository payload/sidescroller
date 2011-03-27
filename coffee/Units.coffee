window.DumbUnit = class DumbUnit extends FlyingObject
    constructor: (@world) ->
        this.init(world)
        this.movement.size.Set(20, 20)
        
        this.move_up = false
        this.move_down = false
        this.move_left = false
        this.move_right = false
        
        this.normsize = null
        this.shooting = new ShootingModel(world)
        this.random_movement = false
        
        dmg = this.damage
        dmg.energy = 10
        dmg.max_energy = 10
        dmg.to_apply = 20
        dmg.factor = 1
        dmg.die = => this.remove()
    
    collide: (dt, other, coll) ->
        if super(dt, other, coll)
            this.movement.rot[0] += (Math.random() - Math.random())
    
    move_up_on: (dt) -> this.move_up = true
    move_up_off: (dt) -> this.move_up = false
    move_down_on: (dt) -> this.move_down = true
    move_down_off: (dt) -> this.move_down = false
    move_left_on: (dt) -> this.move_left = true
    move_left_off: (dt) -> this.move_left = false
    move_right_on: (dt) -> this.move_right = true
    move_right_off: (dt) -> this.move_right = false
    
    shoot_on: ->
        this.normsize = this.movement.size.Copy() if this.normsize is null
    
    shoot_off: ->
        if this.normsize
            this.movement.size.SetV(this.normsize)
            this.normsize = null
    
    shoot: (dt) ->
        if this.normsize != null
            shake = this.normsize.Copy()
            shake.Multiply(1 + 0.3 * (Math.random() - Math.random()))
            this.movement.size.SetV(shake)
        this.shooting.shoot(dt, this.movement)
    
    step: (dt) ->
        if this.random_movement
            this.move_up    = !this.move_up    if Math.random() < 0.1
            this.move_down  = !this.move_down  if Math.random() < 0.1
            this.move_left  = !this.move_left  if Math.random() < 0.1
            this.move_right = !this.move_right if Math.random() < 0.1
    
        polar = b2Vec2.Polar
        pi = 3.14159
        velmax = this.movement.vel_max[0]
        veladd = new b2Vec2(0, 0)
        veladd.AddPolar(pi * 1.5, velmax) if this.move_up
        veladd.AddPolar(pi * 0.0, velmax) if this.move_right
        veladd.AddPolar(pi * 0.5, velmax) if this.move_down
        veladd.AddPolar(pi * 1.0, velmax) if this.move_left
        
        super(dt, veladd)
        this.shooting.step(dt, this.movement)

