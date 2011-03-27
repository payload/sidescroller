window.FlyingObject = class FlyingObject
    init: (@world) ->
        this.movement = new MovementModel()
        this.damage = new DamageModel()
        this.sprite = new Rectangle(world, this)
        this.keep_in_field = false
        this.remove_when_out_of_sight = true
        this.removed = false
        this.show_energy = false
        this.world.add_obj(this)
    
    collide: (dt, other, coll) ->
        obj = other.obj
        if @removed or not obj? or obj.removed or not obj.damage?
        then false
        else @damage.collide(dt, obj.damage, coll);
    
    step: (dt, veladd) ->
        return @remove() if @removed
        this.damage.step(dt)
        this.movement.step(dt, veladd)
        this.remove() if this.remove_when_out_of_sight and this.out_of_sight()
        this.set_pos_to_field() if this.keep_in_field
    
    remove: ->
        if this.removed
            this.world.remove_obj(this)
            this.sprite.remove()
        else
            this.removed = true
    
    out_of_sight: ->
        field = this.world.field
        tl = new b2Vec2(field[0], field[1])
        br = new b2Vec2(field[2], field[3])
        m = this.movement
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
        field = this.world.field
        tl = new b2Vec2(field[0], field[1])
        br = new b2Vec2(field[2], field[3])
        m = this.movement
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
        if this.show_energy
            style = this.sprite.style
            dmg = this.damage
            energy_ratio = dmg.energy / dmg.max_energy
            style.fill = style.stroke.slice(0, 4)
            style.fill[3] = energy_ratio

