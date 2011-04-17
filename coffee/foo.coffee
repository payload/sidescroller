# Copyright © 2011 Gilbert "payload" Röhrbein
# License: GNU AGPL 3, see also COPYING file

window.onload = ->
    canvas = document.getElementById("canvas")
    ctx = canvas.getContext("2d")
    
    keybindings = window.keybindings = new KeyBindings()
    window.onkeydown = (key) -> keybindings.keydown(key)
    window.onkeyup = (key) -> keybindings.keyup(key)
    
    game = new Game(canvas, keybindings)
    
    # shoot with left mouse hack
    key = game.keys.shoot[0]
    canvas.onmousemove = (e) ->
    canvas.onmousedown = (e) -> window.onkeydown({which: key}) if e.button == 0
    canvas.onmouseup = (e) -> window.onkeyup({which: key}) if e.button == 0

    interval = 0.03
    maxdt = 0.01
    setInterval((-> mainloop(game, ctx, canvas, maxdt, interval)), interval*1e3)

mainloop = (game, ctx, canvas, maxdt, interval) ->
    interval *= game.time_factor
    while interval > 0
        dt = if interval - maxdt > 0 then maxdt else interval
        game.step(dt)
        window.keybindings.step(dt)
        interval -= dt
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    game.draw(ctx)

class KeyBindings
    constructor: ->
        # down, up, during
        @bindings = {}
        @active_bindings = {}
    
    enable: (key, down, up, during) ->
        @bindings[key] = 
            down: down
            up: up
            during: during
    
    disable: (key) ->
        active_binding = @active_bindings[key]
        # if key is pressed, call up()
        @bindings[key]?.up?()
        delete @bindings[key]
        delete @active_bindings[key]
    
    step: (dt) ->
        for own i of @active_bindings
            during = @active_bindings[i].during?(dt)
            @active_bindings[i].called = true
    
    keydown: (key) ->
        k = key.which
        #console.log("keydown", k)
        if k of @bindings && !(k of @active_bindings)
            @bindings[k].down?()
            @active_bindings[k] = 
                during: @bindings[k].during
                called: false

    keyup: (key) ->
        k = key.which
        if k of @active_bindings
            {during:during, called:called} = @active_bindings[k]
            during?() if not called
            # call during() at least once between down() and up()
            delete @active_bindings[k]
            @bindings[k].up?()

