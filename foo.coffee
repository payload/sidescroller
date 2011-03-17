window.onload = ->
    canvas = document.getElementById("canvas")
    ctx = canvas.getContext("2d")
    
    window.keybindings = new KeyBindings()
    game = new this.Game(canvas, window.keybindings)
    
    canvas.onmousemove = (e) ->
    
    canvas.onmousedown = (e) ->
        window.onkeydown({which: 16}) if e.button == 0
    
    canvas.onmouseup = (e) ->
        window.onkeyup({which: 16}) if e.button == 0

    interval = 30
    steps = 3
    dt = interval / steps / 1000
    setInterval(
        -> mainloop(game, ctx, canvas, dt, steps),
        interval)

mainloop = (game, ctx, canvas, dt, steps) ->
    for i in [0...steps]
        game.step(dt);
        keybindings.step(dt);
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.draw(ctx);
    ctx.restore();

window.onkeydown = (key) ->
    this.keybindings.keydown(key)

window.onkeyup = (key) ->
    this.keybindings.keyup(key)

class KeyBindings
    constructor: ->
        # down, up, during
        @bindings = {}
        @active_bindings = {}
    
    enable: (key, down, up, during) ->
        console.log("enable #{key} #{down?} #{up?} #{during?}");
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
        if k of this.bindings && !(k of this.active_bindings)
            this.bindings[k].down?()
            this.active_bindings[k] = 
                during: this.bindings[k].during
                called: false

    keyup: (key) ->
        k = key.which
        if k of this.active_bindings
            {during:during, called:called} = this.active_bindings[k]
            during?() if not called
            # call during() at least once between down() and up()
            delete this.active_bindings[k]
            this.bindings[k].up?()

