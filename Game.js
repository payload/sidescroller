include("World.js");
include("Player.js");
include("Obstacle.js");
include("Map.js");
include("Enemy.js");

(function() {
    
    this.Game = function(canvas, bindings) {
        return new O(canvas, bindings);
    };

    var O = function(canvas, bindings) {
        this.canvas = canvas;
        this.bindings = bindings;
        this.world = this.create_world();
        this.map = this.create_map();
        this.player = this.create_player();

        this.create_some_obstacles();
        this.create_some_enemies();

    
        var player = this.player;
        bindings[87] = [null, null,
            function(){player.move_up()}]; // W
        bindings[65] = [null, null,
            function(){player.move_left()}]; // A
        bindings[83] = [null, null,
            function(){player.move_down()}]; // S
        bindings[68] = [null, null,
            function(){player.move_right()}]; // D
        bindings[16] = [function(){player.shoot()}, null,
            function(){player.shoot()}]; // Shift

        /*        
        bindings[38] = [null, null, 
            function(){player.move_up()}]; // Up
        bindings[37] = [null, null,
            function(){player.move_left()}]; // Left
        bindings[40] = [null, null,
            function(){player.move_down()}]; // Down
        bindings[39] = [null, null,
            function(){player.move_right()}]; // Right
            
        var map = this.map;
        // Z G H J
        bindings[90] = [null, null,
            function(){map.scroll_up()}];
        bindings[71] = [null, null,
            function(){map.scroll_left()}];
        bindings[72] = [null, null,
            function(){map.scroll_down()}];
        bindings[74] = [null, null,
            function(){map.scroll_right()}];
        */
    };

    O.prototype.create_some_obstacles = function() {
        var world = this.world;
        for (var i = 0; i < 1; i++) {
            var pos = new b2Vec2(2, 0);
            new Obstacle(world, pos);
        }
    };
    
    O.prototype.create_some_enemies = function() {
        var world = this.world;
        for (var i = 0; i < 1; i++) {
            var enemy = new Enemy(world);
            enemy.pos.Set(3, 1);
            enemy.vel.Set(-1, 0);
        }
    };

    O.prototype.create_player = function() {
        var pos = new b2Vec2(1, 1);
        var player = new Player(this.world, pos);
        return player;
    };

    O.prototype.create_map = function() {
        var w = 6;
        var h = 4;
        var s = 0.5;
        var map = new Map(this.world);
        /*map.make_walls_inplace([
            [w/2, h, w/2, s, 0]
        ]);*/
        return map;
    };

    O.prototype.create_world = function() {
        var world = new World();
        return world;
    };
    
    O.prototype.step = function() {
        var dt = 0.01;

        this.world.step(dt);

        this.world.foreach_obj( function(obj) {
            if ("step" in obj) obj.step(dt);
        });
    };
    
    O.prototype.draw = function(ctx) {
        ctx.save();
        
        ctx.scale(100, 100);
        ctx.lineWidth = 0.02;
        
        ctx.strokeStyle = "gray";
        
        this.world.foreach_shape( function(obj) {
            if ("draw" in obj) obj.draw(ctx);
        });
        
        ctx.restore();
    };
})();

