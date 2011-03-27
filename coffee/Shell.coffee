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
        if @world.laser_sounds.length > 0
            i = @world.laser_sound
            while true
                snd = @world.laser_sounds[@world.laser_sound]
                @world.laser_sound = (@world.laser_sound + 1) % @world.laser_sounds.length
                if snd.ended or snd.paused
                    snd.currentTime = 0 if snd.currentTime != 0
                    snd.play()
                    break
                if @world.laser_sound == i
                    break
            

    remove: (player_hits_enemy) ->
        if player_hits_enemy != true and 'player' in @damage.groups
            @world.shell_miss() 
        super()
        
