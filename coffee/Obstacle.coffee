window.Obstacle = class Obstacle extends FlyingObject
    constructor: (@world) ->
        @init(world)
        
        m = @movement
        dmg = @damage

        m.size.Set(10, 10)
        m.vel.Set(-160 + 40 * Math.random(), 0)
        m.vel_want.SetV(m.vel)

        dmg.energy = 0
        dmg.to_apply = 30
        dmg.factor = 0
        dmg.die = ->

