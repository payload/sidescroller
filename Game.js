include("World.js");
include("Obstacle.js");
include("Units.js");

+function() {
    
    this.Game = function(canvas, bindings) {
        this.canvas = canvas;
        this.bindings = bindings;
        this.width = canvas.width;
        this.height = canvas.height;
        this.world = this.create_world();
        this.create_player();
        this.create_spawner();
    };

    var proto = Game.prototype;

    proto.create_some_obstacles = function(count) {
        var world = this.world,
            width = this.width,
            height = this.height;
        for (var i = 0; i < count; i++) {
            var obj = new Obstacle(world),
                m = obj.movement,
                x = width + 10,
                y = height * Math.random();
            m.pos.Set(x, y);
            m.vel.Set(-120 + 40 * Math.random(), 0);
            m.vel_want.SetV(m.vel);
        }
    };
    
    proto.create_spawner = function() {
        var that = this,
            t = new Timer(this.world, 0.4, function() {
            if (Math.random() < 0.3)
                that.create_some_enemies(1 + 2 * Math.random());
            if (Math.random() < 0.3)
                that.create_some_obstacles(1 + 3 * Math.random());
        });
    };
    
    proto.create_some_enemies = function(count) {
        var world = this.world,
            width = this.width,
            height = this.height;
        for (var i = 0; i < count; i++) {
            var obj = new DumbUnit(world),
                m = obj.movement,
                x = width + 10,
                y = height * Math.random();
            m.pos.Set(x + m.size.x, y);
            m.vel.Set(-100 + 40 * Math.random(), 0);
            m.vel_want.SetV(m.vel);
        }
    };

    proto.create_player = function() {
        var world = this.world,
            width = this.width,
            height = this.height,
            player = new DumbUnit(world),
            x = width * Math.random(),
            y = height * Math.random();
        player.keep_in_field = true;
        player.movement.pos.Set(x, y);
        
        // W
        bindings[87] = [
            function(dt){player.move_up_on(dt)},
            function(dt){player.move_up_off(dt)},
            null];
        // A
        bindings[65] = [
            function(dt){player.move_left_on(dt)}, 
            function(dt){player.move_left_off(dt)},
            null];
        // S
        bindings[83] = [
            function(dt){player.move_down_on(dt)}, 
            function(dt){player.move_down_off(dt)},
            null];
        // D
        bindings[68] = [
            function(dt){player.move_right_on(dt)}, 
            function(dt){player.move_right_off(dt)},
            null];
        // Shift
        bindings[16] = [
            function(){player.shoot_on()},
            function(){player.shoot_off()},
            function(dt){player.shoot(dt)}];
        
        return player;
    };

    proto.create_world = function() {
        var field = [0, 0, this.width, this.height],
            world = new World(field);
        return world;
    };
    
    proto.collision_handler = function(dt, coll) {
        if ("obj" in coll.a) {
            var obj = coll.a.obj;
            if (obj && "collide" in obj)
                obj.collide(dt, coll.b, coll);
        }
        if ("obj" in coll.b) {
            var obj = coll.b.obj;
            if (obj && "collide" in obj)
                obj.collide(dt, coll.a, coll);
        }
    };
    
    proto.step = function(dt) {
        var chandler = this.collision_handler,
            collisions = this.world.get_collisions();
        for (var i = 0, collision; collision = collisions[i]; i++) {
            chandler(dt, collision);
        }
        this.world.foreach_timer( function(obj) {
            if ("step" in obj) obj.step(dt);
        });
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
}();

+function(){
    this.Timer = function(world, interval, callback){
        this.interval = interval === undefined ? 1 : interval;
        this.running = true;
        this.accum = 0;
        this.callback = callback || null;
        world.add_timer(this);
    };   
    var proto = Timer.prototype;
    
    proto.start = function() {
        this.running = true;
    };
    
    proto.stop = function() {
        this.running = false;
        this.accum = 0;
    };
    
    proto.pause = function() {
        this.running = false;
    };
    
    proto.restart = function() {
        this.running = true;
        this.accum = 0;
    };
    
    proto.step = function(dt) {
        if (!this.running) return;
        this.accum += dt;
        if (this.accum >= this.interval) {
            while (this.accum >= this.interval)
                this.accum = this.interval - this.accum;
            if (this.callback)
                this.callback();
        }
    };
}();
