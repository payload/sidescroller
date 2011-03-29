window.DamageModel = class DamageModel
    constructor: ->
        @energy = 0
        @max_energy = 0
        @factor = 1
        @to_apply = 0
        @regenerate = 0
        @groups = []
        @die = ->

    step: (dt) ->
        return undefined if @regenerate == 0
        if @energy < @max_energy 
            @energy = Math.min(
                @energy + @regenerate * dt,
                @max_energy)
    
    check_group: (a, b) ->
        (return true if g in b) for g in a
        false
    
    apply_damage: (dt, dmg, to_apply) ->
        return false if @check_group(@groups, dmg.groups)
        dmg.energy -= to_apply * dmg.factor * dt
        dmg.die(this) if dmg.energy < 0
        true

    collide: (dt, dmg, coll) -> @apply_damage(dt, dmg, @to_apply)
    explode: (other, damage) -> @apply_damage(1, other, damage)
