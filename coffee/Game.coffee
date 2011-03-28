window.Game = class Game
    constructor: (@canvas, @bindings) ->
        @width = @canvas.width
        @height = @canvas.height
        @world = @create_world()
        @player = @create_player()
        @spawner = @create_spawner()
        @pause = false
        @game_over = false
        @keys = @create_keys()
        @texts = @create_texts()
        @actions = @create_actions()
        @set_bindings()

    create_keys: ->
        up: [87, 75, 38]
        left: [65, 72, 37]
        down: [83, 74, 40]
        right: [68, 76, 39]
        shoot: [16, 32]
        pause: [80]
        mute: [77]

    create_texts: ->
        reload: "Reload with F5 or Ctrl+R to play it again!"
        game_over: "GAME OVER"
        score: (score) ->
            if score == 1 then "#{score} point" else "#{score} points"

    create_actions: ->
        up: [
            (dt) => @player.move_up_on(dt),
            (dt) => @player.move_up_off(dt),
            null]
        left: [
            (dt) => @player.move_left_on(dt),
            (dt) => @player.move_left_off(dt),
            null]
        down: [
            (dt) => @player.move_down_on(dt),
            (dt) => @player.move_down_off(dt),
            null]
        right: [
            (dt) => @player.move_right_on(dt), 
            (dt) => @player.move_right_off(dt),
            null]
        shoot: [
            => @player.shoot_on(),
            => @player.shoot_off(),
            (dt) => @player.shoot(dt)]
        pause: [null, (=> @switch_pause()), null]
        mute: [null, (=> @world.switch_mute()), null]

    set_bindings: ->
        @enable_binding(@keys[x], @actions[x]) for own x of @actions

    disable_player_bindings: ->
        for own y of @actions
            if y not in ['pause', 'mute'] 
                @bindings.disable(x) for x in @keys[y] 

    enable_binding: (keys, action) ->
        @bindings.enable.apply(@bindings, [k].concat(action)) for k in keys

    switch_pause: ->
        @pause = !@pause
        if @pause
        then @disable_player_bindings()
        else @set_bindings()

    create_some_obstacles: (count) ->
        for i in [0...count]
            obj = new Obstacle(@world)
            x = @width + 10
            y = @height * Math.random()
            obj.movement.pos.Set(x, y)
    
    create_spawner: ->
        new Timer(@world, 0.4, =>
            if (Math.random() < 0.2)
                @create_some_enemies(1 + 2 * Math.random())
            if (Math.random() < 0.3)
                @create_some_obstacles(1 + 3 * Math.random())
        )
    
    create_some_enemies: (count) ->
        for i in [0...count]
            obj = new DumbUnit(@world)
            m = obj.movement
            x = @width + 10
            y = @height * Math.random()
            obj.damage.groups.push("enemy")
            obj.shooting.shell_group = "enemy"
            m.pos.Set(x + m.size.x, y)
            m.vel.Set(-100 + 40 * Math.random(), 0)
            m.vel_want.SetV(m.vel)
            obj.random_movement = true if Math.random() < 0.5
    
    create_player: ->
        player = new DumbUnit(@world)
        x = @width * Math.random()
        y = @height * Math.random()
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
        field = [0, 0, @width, @height]
        world = new World(field)
        world
    
    collision_handler: (dt, coll) ->
        coll.a.obj?.collide?(dt, coll.b, coll)
        coll.b.obj?.collide?(dt, coll.a, coll)
    
    step: (dt) ->
        return undefined if @pause
        chandler = @collision_handler
        collisions = @world.get_collisions()
        chandler(dt, collision) for collision in collisions
        @world.step(dt)
    
    draw: (ctx) ->
        create_style: ->
        normal_font = (ctx) ->
            ctx.font = "1em VT323"
        big_font = (ctx) ->
            ctx.font = "5em VT323"
        
        ctx.save()
        ctx.lineWidth = 2
        ctx.strokeStyle = "gray"
        @world.draw_objs()
        @world.draw_shapes(ctx)
        # score
        score = Math.round(@world.score)
        score = @texts.score(score)
        ctx.save()
        ctx.translate(6, 15)
        normal_font(ctx)
        ctx.fillText(score, 0, 0)
        ctx.restore()
        # game over screen
        if @game_over
            ctx.save()
            cw = @width/2
            ch = @height/2
            ctx.translate(cw, ch)
            ctx.textAlign = "center"
            
            ctx.save()
            normal_font(ctx)
            ctx.fillText(@texts.reload, 0, 22)
            ctx.restore()
            
            ctx.save()
            big_font(ctx)
            ctx.fillText(@texts.game_over, 0, 0)
            ctx.restore()
            
            ctx.restore()
        ctx.restore()


