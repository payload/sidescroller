# Copyright © 2011 Gilbert "payload" Röhrbein
# License: GNU AGPL 3, see also COPYING file

class Obstacle extends FlyingObject
    constructor: (@world) ->
        super(world)
        m = @movement
        m.size.Set(10, 10)
        m.vel.Set(-160 + 40 * Math.random(), 0)
        m.vel_want.SetV(m.vel)
        dmg = @damage
        dmg.energy = 0
        dmg.to_apply = 30
        dmg.factor = 0
        dmg.die = ->

