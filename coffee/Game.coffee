# Copyright © 2011 Gilbert "payload" Röhrbein
# License: GNU AGPL 3, see also COPYING file

class Game
    constructor: (@dom, @bindings) ->
        @canvas = @dom.canvas
        @width = @canvas.width
        @height = @canvas.height
        @world = @create_world()
        @player = @create_player()
        @spawner = @create_spawner()
        @pause = false
        @game_over = false
        @time_factor = 1
        @time_factor_display = false
        @keys = @create_keys()
        @texts = @create_texts()
        @actions = @create_actions()
        @set_bindings()
        @myscore = 0
        @mynick = "Anony Mous"

    create_keys: ->
        up: [87, 75, 38]
        left: [65, 72, 37]
        down: [83, 74, 40]
        right: [68, 76, 39]
        shoot: [16, 32]
        pause: [80]
        mute: [77]
        time_slower: [189]
        time_faster: [187]
        time_normal: [48]

    create_texts: ->
        reload: "Reload with F5 or Ctrl+R to play it again!"
        game_over: "GAME OVER"
        score: (score) ->
            if score == 1 then "#{score} point" else "#{score} points"
        time_factor_display: (tf) ->
            tf = Math.round(tf * 100) / 100
            "#{tf} time"

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
        time_slower: [
            => @time_display(true),
            => @time_display(false),
            (dt) => @time_slower(dt)]
        time_faster: [
            => @time_display(true),
            => @time_display(false),
            (dt) => @time_faster(dt)]
        time_normal: [null, ((dt) => @time_normal(dt)), null]

    time_slower: (dt) -> @time_factor *= 1 - 0.5 * dt
    time_faster: (dt) ->
        @time_factor = Math.min(@time_factor * (1 + 0.5 * dt), 16)
    time_normal: (dt) -> @time_factor = 1
    time_display: (b) -> @time_factor_display = b

    set_bindings: ->
        @enable_binding(@keys[x], @actions[x]) for own x of @actions

    disable_player_bindings: () =>
        @disable_bindings( (x) => x not in ['pause', 'mute'] )

    disable_bindings: (filter) =>
        for own y of @actions
            if not filter or filter(y)
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
            s = obj.movement.size.Length()
            x = @width + s
            y = @height * Math.random()
            y = Math.max(Math.min(y, @height - s / 2), s / 2)
            obj.movement.pos.Set(x, y)
            obj.damage.groups.push("obstacle")

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
            s = m.size.Length()
            x = @width + s
            y = @height * Math.random()
            y = Math.max(Math.min(y, @height - s / 2), s / 2)
            obj.damage.groups.push("enemy")
            obj.damage.energy = 6
            # I don't set obj.damage.max_energy here, cause I want to use the
            # different drawing of an enemy, caused by this missing of energy
            obj.shooting.shell_group = "enemy"
            m.pos.Set(x + m.size.x, y)
            m.vel.Set(-100 + 40 * Math.random(), 0)
            m.vel_want.SetV(m.vel)
            obj.random_movement = 0.01 if Math.random() < 0.5
            if obj.random_movement and Math.random() < 0.5
                obj.keep_right_movement = true
                obj.damage.groups.push("obstacle")
                obj.show_energy = true
                obj.damage.regenerate = -0.4

    create_player: ->
        player = new DumbUnit(@world)
        s = player.movement.size.Length()
        x = @width / 2 * Math.random()
        x = Math.max(Math.min(x, @width - s / 2), s / 2)
        y = @height * Math.random()
        y = Math.max(Math.min(y, @height - s / 2), s / 2)
        player.damage.regenerate = 0.4
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
            screen = @dom.gameover
            $(screen).css("visibility", "visible")
            @show_highscore()
            @disable_bindings()
        player

    fetch_highscore: (score) =>
        # TODO fetch highscore from server
        [{
            rank: 0
            nick: undefined
            score: score
            },{
            rank: 1
            nick: "foo"
            score: "some"
        }]

    push_highscore_entry: (nick, score) =>
        # TODO push highscore entry to server
        alert(nick, score)

    close: () =>
        if @game_over
            @push_highscore_entry(@mynick, @myscore)

    show_highscore: () =>
        @myscore = Math.round(@world.score)
        highscore = @fetch_highscore(@myscore)
        { hstable, hsline } = @dom
        $(hstable).empty()
        for { rank, nick, score } in highscore
            line = hsline.clone(true)
            tds = line.children()
            hsrank = tds.filter(".highscore_rank")
            hsnick = tds.filter(".highscore_nick")
            hsscore = tds.filter(".highscore_score")
            hsrank.append("#{rank}.")
            hsnick_input = hsnick.children().filter("input")
            if nick is undefined
                hsnick_input.prop { value: "Anony Mous"}
                mynick = hsnick_input
            else
                hsnick_input.prop { value: nick } # TODO readonly
            hsscore.append("#{score}")
            $(hstable).append(line)
            mynick.focus()
            mynick.change () =>
                @mynick = mynick.html()

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
        normal_font(ctx)
        ctx.fillText(score, 6, 15)
        ctx.restore()
        # time factor display
        if @time_factor_display
            tf = @texts.time_factor_display(@time_factor)
            ctx.save()
            normal_font(ctx)
            ctx.fillText(tf, 6, 40)
            ctx.restore()
        ctx.restore()

