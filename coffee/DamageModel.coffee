window.DamageModel = class DamageModel
    constructor: ->
        this.energy = 0
        this.max_energy = 0
        this.factor = 1
        this.to_apply = 0
        this.regenerate = 0
        this.groups = []
        this.die = ->

    step: (dt) ->
        return undefined if this.regenerate == 0
        if this.energy < this.max_energy 
            this.energy = Math.min(
                this.energy + this.regenerate * dt,
                this.max_energy)
    
    check_group: (a, b) ->
        for g in a
            return true if g in b
        false
    
    apply_damage: (dt, dmg, to_apply) ->
        return false if this.check_group(this.groups, dmg.groups)
        dmg.energy -= to_apply * dmg.factor * dt
        dmg.die(this) if dmg.energy < 0
        true

    collide: (dt, dmg, coll) ->    
        this.apply_damage(dt, dmg, this.to_apply)
    
    explode: (other, damage) ->
        this.apply_damage(1, other, damage)


