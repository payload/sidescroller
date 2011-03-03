include("World.js");
include("Obstacle.js");
include("Units.js");

(function() {
    
    this.Game = function(canvas, bindings) {
        return new O(canvas, bindings);
    };

    var O = function(canvas, bindings) {
        this.canvas = canvas;
        this.bindings = bindings;
        this.width = canvas.width;
        this.height = canvas.height;
        this.world = this.create_world();
        this.create_some_obstacles();
        this.create_some_units();
        this.create_player();
    };
    var proto = O.prototype;

    proto.create_some_obstacles = function() {
        var world = this.world,
            width = this.width,
            height = this.height;
        for (var i = 0; i < 1; i++) {
            var obj = new Obstacle(world);
            
            var x = width * Math.random(),
                y = height * Math.random();
            obj.pos.Set(x, y);
        }
    };
    
    proto.create_some_units = function() {
        var world = this.world,
            width = this.width,
            height = this.height;
        for (var i = 0; i < 20; i++) {
            var obj = new DumbUnit(world);
            
            var x = width + 5 * width * Math.random(),
                y = height * Math.random();
            obj.pos.Set(x, y);
            obj.vel.Set(-100, 0);
            obj.vel_want.SetV(obj.vel);
        }
    };

    proto.create_player = function() {
        var world = this.world,
            width = this.width,
            height = this.height;

        var player = new DumbUnit(world);
        player.keep_in_field = true;
        
        var x = width * Math.random(),
            y = height * Math.random();
        player.pos.Set(x, y);
        
        bindings[87] = [
            function(dt){player.move_up_on(dt)},
            function(dt){player.move_up_off(dt)},
            null]; // W
        bindings[65] = [
            function(dt){player.move_left_on(dt)}, 
            function(dt){player.move_left_off(dt)},
            null]; // A
        bindings[83] = [
            function(dt){player.move_down_on(dt)}, 
            function(dt){player.move_down_off(dt)},
            null]; // S
        bindings[68] = [
            function(dt){player.move_right_on(dt)}, 
            function(dt){player.move_right_off(dt)},
            null]; // D
        bindings[16] = [
            function(){player.shoot_on()},
            function(){player.shoot_off()},
            function(dt){player.shoot(dt)}]; // Shift
        
        return player;
    };

    proto.create_world = function() {
        var field = [0, 0, this.width, this.height];
        var world = new World(field);
        return world;
    };
    
    proto.collision_handler = function(coll) {
        if ("obj" in coll.a) {
            var obj = coll.a.obj;
            if (obj && "collide" in obj)
                obj.collide(coll.b, coll);
        }
        if ("obj" in coll.b) {
            var obj = coll.b.obj;
            if (obj && "collide" in obj)
                obj.collide(coll.a, coll);
        }
    };
    
    proto.step = function(dt) {
        var chandler = this.collision_handler;
        var collisions = this.world.get_collisions();
        for (var i = 0, collision; collision = collisions[i]; i++) {
            chandler(collision);
        }
        this.world.foreach_obj( function(obj) {
            if ("step" in obj) obj.step(dt);
        });
    };
    
    proto.draw = function(ctx) {
        ctx.save();
        
        ctx.lineWidth = 2;
        ctx.strokeStyle = "gray";
        
        this.world.foreach_shape( function(obj) {
            if ("draw" in obj) obj.draw(ctx);
        });
        
        ctx.restore();
    };
})();

