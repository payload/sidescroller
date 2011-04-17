# Copyright © 2011 Gilbert "payload" Röhrbein
# License: GNU AGPL 3, see also COPYING file

class FlyingObject
    constructor: (@world) ->
        @movement = new MovementModel()
        @damage = new DamageModel()
        @sprite = new Rectangle(world, this)
        @keep_in_field = false
        @remove_when_out_of_sight = true
        @removed = false
        @show_energy = false
        @show_energy_0_fill = null
        @world.add_obj(this)
    
    collide: (dt, other, coll) ->
        obj = other.obj
        if @removed or not obj? or obj.removed or not obj.damage?
        then false
        else @damage.collide(dt, obj.damage, coll);
    
    step: (dt, veladd) ->
        return @remove() if @removed
        @damage.step(dt)
        @movement.step(dt, veladd)
        @remove() if @remove_when_out_of_sight and @out_of_sight()
        @set_pos_to_field() if @keep_in_field
    
    remove: ->
        if @removed
            @world.remove_obj(this)
            @sprite.remove()
        else
            @removed = true
    
    out_of_sight: ->
        field = @world.field
        tl = new b2Vec2(field[0], field[1])
        br = new b2Vec2(field[2], field[3])
        m = @movement
        pos = m.pos
        s = m.size.Length()
        svec = new b2Vec2(s, s)
        br.x *= 2
        tl.Subtract(svec)
        br.Add(svec)

        pos.x < tl.x ||
        pos.x > br.x ||
        pos.y < tl.y ||
        pos.y > br.y
    
    set_pos_to_field: ->
        field = @world.field
        tl = new b2Vec2(field[0], field[1])
        br = new b2Vec2(field[2], field[3])
        m = @movement
        pos = m.pos
        vel = m.vel
        s = m.size.Length()
        svec = new b2Vec2(s*0.5, s*0.5)
        tl.Add(svec)
        br.Subtract(svec)
        if pos.x < tl.x
            pos.x = tl.x;
            vel.Set(0, vel.y)
        if pos.x > br.x
            pos.x = br.x;
            vel.Set(0, vel.y)
        if pos.y < tl.y
            pos.y = tl.y;
            vel.Set(vel.x, 0);
        if pos.y > br.y
            pos.y = br.y;
            vel.Set(vel.x, 0);

    draw: ->
        if @show_energy
            style = @sprite.style
            @show_energy_0_fill = style.fill.slice(0, 4) if @show_energy_0_fill == null
            e = Math.min(Math.max(@damage.energy / @damage.max_energy, 0), 1)
            a = style.stroke
            b = @show_energy_0_fill
            style.fill[i] = b[i] + (a[i] - b[i]) * e for i in [0..2]

