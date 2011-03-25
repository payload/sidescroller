window.Game = class Game
    constructor: (@canvas, @bindings) ->
        this.width = @canvas.width
        this.height = @canvas.height
        this.world = this.create_world()
        this.player = this.create_player()
        this.create_spawner()
        this.pause = false
        this.game_over = false
        @keys =
            up: [87, 75, 38]
            left: [65, 72, 37]
            down: [83, 74, 40]
            right: [68, 76, 39]
            shoot: [16, 32]
            pause: [80]
            mute: [77]
        this.set_bindings()

    disable_player_bindings: ->
        keys = @keys
        all_keys = []
        all_keys = all_keys.concat(action) for action in keys
        this.bindings.disable(x) for k in all_keys

    set_bindings: ->
        that = this
        bindings = this.bindings
        player = this.player
        keys = @keys
        
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
        
        # M
        for k in keys.mute
            bindings.enable(k,
                null,
                => @world.switch_mute(),
                null)
        # P
        for k in keys.pause
            bindings.enable(k,
                null,
                -> that.switch_pause(),
                null)
        # W, K, ↑
        for k in keys.up
            bindings.enable.apply(bindings, [k].concat(up))
        # A, H, ←
        for k in keys.left
            bindings.enable.apply(bindings, [k].concat(left))
        # S, J, ↓
        for k in keys.down
            bindings.enable.apply(bindings, [k].concat(down))
        # D, L, →
        for k in keys.right
            bindings.enable.apply(bindings, [k].concat(right))
        # Shift, Space
        for k in keys.shoot
            bindings.enable(k,
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
        t = new window.Timer(this.world, 0.4, =>
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
        score = Math.round(@world.score)
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


