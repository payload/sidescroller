window.Shell = class Shell extends FlyingObject
    constructor: (@world) ->
        this.init(world)
        this.movement.size.Set(5, 5)
        that = this
        this.damage.die = (other) ->
            player_hits_enemy = 'player' in @groups and 'enemy' in other.groups
            that.world.inc_score() if player_hits_enemy
            that.remove(player_hits_enemy)
            this.explode(other, 1)

    remove: (player_hits_enemy) ->
        if not player_hits_enemy and 'player' in @damage.groups
            @world.shell_miss() 
        super()
        
