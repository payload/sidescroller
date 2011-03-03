console.log("main begin");

var include = function(file) {
    var args = 'type="text/javascript" src="' + file;
    document.write('<script '+args+'"></script>');
};

include("Game.js");

window.onload = function(prog) {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    
    var game = new Game(canvas, bindings);
    
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
    
    setInterval(function() {
        loop(game, ctx, canvas);
    }, 10);
};

var loop = function(game, ctx, canvas) {
    game.step();

    for (var i in active_bindings) {
        var during = active_bindings[i][0];
        if (during) during();
        active_bindings[i][1] = true;
    }

    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    game.draw(ctx);

    ctx.restore();
};

// down, up, during
var bindings = {};

var active_bindings = {};

window.onkeydown = function(key) {
    var k = key.which;
    console.log("keydown", k);
    if (k in bindings && !(k in active_bindings)) {
        var down = bindings[k][0];
        if (down) down();
        var during = bindings[k][2];
        active_bindings[k] = [during, false];
    };
};

window.onkeyup = function(key) {
    var k = key.which;
    if (k in bindings) {
        var during = bindings[k][2];
        if (during) {
            var during_called = active_bindings[k];
            if (!during_called || !during_called[1]) during();
        }
        delete active_bindings[k];
        var up = bindings[k][1];
        if (up) up();
    };
};

