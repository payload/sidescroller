window.Shell = class Shell extends FlyingObject
    constructor: (@world) ->
        this.init(world)
        this.movement.size.Set(5, 5)
        that = this
        this.damage.die = (other) ->
            player_hits_enemy = 'player' in @groups and 'enemy' in other.groups
            that.world.inc_score() if player_hits_enemy
            that.remove()
            this.explode(other, 1)

