window.Game = class Game
    constructor: (@canvas, @bindings) ->
        this.width = @canvas.width
        this.height = @canvas.height
        this.world = this.create_world()
        this.player = this.create_player()
        this.create_spawner()
        this.pause = false
        this.game_over = false
        this.set_bindings()

    disable_player_bindings: ->
        for x in [87, 65, 83, 68, 16, 72, 74, 75, 76, 37, 38, 39, 40]
            this.bindings.disable(x)

    set_bindings: ->
        that = this
        bindings = this.bindings
        player = this.player
        # P
        bindings.enable(80,
            null,
            -> that.switch_pause(),
            null)

        up = [
            (dt) -> player.move_up_on(dt),
            (dt) -> player.move_up_off(dt),
            null]
        left = [
            (dt) -> player.move_left_on(dt),
            (dt) -> player.move_left_off(dt),
            null]
        down = [
            (dt) -> player.move_down_on(dt),
            (dt) -> player.move_down_off(dt),
            null]
        right = [
            (dt) -> player.move_right_on(dt), 
            (dt) -> player.move_right_off(dt),
            null]
        # W, K
        bindings.enable.apply(bindings, [87].concat(up))
        bindings.enable.apply(bindings, [75].concat(up))
        bindings.enable.apply(bindings, [38].concat(up))
        # A, H
        bindings.enable.apply(bindings, [65].concat(left))
        bindings.enable.apply(bindings, [72].concat(left))
        bindings.enable.apply(bindings, [37].concat(left))
        # S, J
        bindings.enable.apply(bindings, [83].concat(down))
        bindings.enable.apply(bindings, [74].concat(down))
        bindings.enable.apply(bindings, [40].concat(down))
        # D, L
        bindings.enable.apply(bindings, [68].concat(right))
        bindings.enable.apply(bindings, [76].concat(right))
        bindings.enable.apply(bindings, [39].concat(right))
        # Shift
        bindings.enable(16,
            -> player.shoot_on(),
            -> player.shoot_off(),
            (dt) -> player.shoot(dt))

    switch_pause: ->
        this.pause = !this.pause
        if this.pause
        then this.disable_player_bindings()
        else this.set_bindings()

    create_some_obstacles: (count) ->
        world = this.world
        width = this.width
        height = this.height
        for i in [0...count]
            obj = new Obstacle(world)
            x = width + 10
            y = height * Math.random()
            obj.movement.pos.Set(x, y)
    
    create_spawner: ->
        t = new Timer(this.world, 0.4, =>
            if (Math.random() < 0.2)
                this.create_some_enemies(1 + 2 * Math.random())
            if (Math.random() < 0.3)
                this.create_some_obstacles(1 + 3 * Math.random())
        )
    
    create_some_enemies: (count) ->
        world = this.world
        width = this.width
        height = this.height
        for i in [0...count]
            obj = new DumbUnit(world)
            m = obj.movement
            x = width + 10
            y = height * Math.random()
            obj.damage.groups.push("enemy")
            obj.shooting.shell_group = "enemy"
            m.pos.Set(x + m.size.x, y)
            m.vel.Set(-100 + 40 * Math.random(), 0)
            m.vel_want.SetV(m.vel)
            obj.random_movement = true if Math.random() < 0.5
    
    create_player: ->
        world = this.world
        width = this.width
        height = this.height
        player = new DumbUnit(world)
        x = width * Math.random()
        y = height * Math.random()
        player.damage.regenerate = 0.3
        player.keep_in_field = true
        player.shooting.auto_shoot = false
        player.shooting.recharge_time = 0.05
        player.shooting.shell_vel.Set(1200, 0)
        player.damage.groups.push("player")
        player.shooting.shell_group = "player"
        player.movement.pos.Set(x, y)
        player.show_energy = true
        die = player.damage.die
        player.damage.die = (other) =>
            die(other)
            @game_over = true
        player

    create_world: ->
        field = [0, 0, this.width, this.height]
        world = new window.World(field)
        world
    
    collision_handler: (dt, coll) ->
        coll.a.obj?.collide?(dt, coll.b, coll)
        coll.b.obj?.collide?(dt, coll.a, coll)
    
    step: (dt) ->
        return undefined if @pause
        chandler = this.collision_handler
        collisions = this.world.get_collisions()
        chandler(dt, collision) for collision in collisions
        this.world.step(dt)
    
    draw: (ctx) ->
        this.world.draw_objs()
        ctx.save()
        ctx.lineWidth = 2
        ctx.strokeStyle = "gray"
        this.world.draw_shapes(ctx)
        score = @world.score
        score = if score == 1 then "#{score} point" else "#{score} points"
        ctx.font = "1em VT323"
        ctx.fillText(score, 10, 15)
        if @game_over
            ctx.font = "5em VT323"
            ctx.textAlign = "center"
            ctx.fillText("GAME OVER", 320, 240)
            ctx.font = "1em VT323"
            ctx.fillText("Reload with F5 or Ctrl+R to play it again!", 320, 262)
        ctx.restore()


