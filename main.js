var include = function(file) {
    var args = 'type="text/javascript" src="' + file;
    document.write('<script '+args+'"></script>');
};

function inherit(a, b) {
    a.prototype = new b();
    a.prototype.constructor = a;
    return a;
}

include("b2Vec2.js");
include("Game.js");
include("FlyingObject.js");
include("World.js");
include("Obstacle.js");
include("Units.js");
include("Sprites.js");
include("ShootingModel.js");
include("Shell.js");
include("DamageModel.js");
include("MovementModel.js");
include("Timer.js");

window.onload = function(prog) {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    
    this.keybindings = new KeyBindings();
    var game = new Game(canvas, this.keybindings);
    
    canvas.onmousemove = function(e) {
    };
    
    canvas.onmousedown = function(e) {
        if (e.button != 0) return;
        window.onkeydown({which: 16});
    };
    
    canvas.onmouseup = function(e) {
        if (e.button != 0) return;
        window.onkeyup({which: 16});
    };
    
    var interval = 10;
    var dt = interval/1000;
    
    setInterval(function() {
        loop(game, ctx, canvas, dt);
    }, interval);
};

var loop = function(game, ctx, canvas, dt) {
    game.step(dt);

    keybindings.step(dt);

    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    game.draw(ctx);

    ctx.restore();
};

+function(){
    var KeyBindings = function() {
        // down, up, during
        this.bindings = {}
        this.active_bindings = {}
    };
    this.KeyBindings = KeyBindings;
    var proto = KeyBindings.prototype;
    
    proto.enable = function(key, down, up, during) {
        this.bindings[key] = [down, up, during];
    };
    
    proto.disable = function(key) {
        var active_binding = this.active_bindings[key];
        if (active_binding) { // if key is pressed
            if (active_binding[1])
                this.bindings[key][1](); // call up
        }
        delete this.bindings[key];
        delete this.active_bindings[key];
    };
    
    proto.step = function(dt) {
        var active_bindings = this.active_bindings;
        for (var i in active_bindings) {
            var during = active_bindings[i][0];
            if (during) during(dt);
            active_bindings[i][1] = true;
        }
    };
    
    proto.keydown = function(key) {
        var k = key.which;
        console.log("keydown", k);
        if (k in this.bindings && !(k in this.active_bindings)) {
            var down = this.bindings[k][0];
            if (down) down();
            var during = this.bindings[k][2];
            this.active_bindings[k] = [during, false];
        }
    };
    
    proto.keyup = function(key) {
        var k = key.which;
        if (k in this.bindings) {
            var during = this.bindings[k][2];
            if (during) {
                var during_called = this.active_bindings[k];
                if (!during_called || !during_called[1]) during();
            }
            delete this.active_bindings[k];
            var up = this.bindings[k][1];
            if (up) up();
        }
    };
}();

window.onkeydown = function(key) {
    keybindings.keydown(key);
};

window.onkeyup = function(key) {
    keybindings.keyup(key);
};

