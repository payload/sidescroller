+function() {
    
    this.Game = function(canvas, bindings) {
        console.log("Game");
        this.canvas = canvas;
        this.bindings = bindings;
        this.width = canvas.width;
        this.height = canvas.height;
        this.world = this.create_world();
        this.player = this.create_player();
        this.create_spawner();
        this.pause = false;
        this.set_bindings();
    };
    var proto = Game.prototype;

    proto.disable_player_bindings = function() {
        var that = this;
        [87, 65, 83, 68, 16, 72, 74, 75, 76].forEach(function(x){
            that.bindings.disable(x);
        });
    };

    proto.set_bindings = function() {
        var that = this,
            bindings = this.bindings,
            player = this.player;
        // P
        bindings.enable(80,
            null,
            function() { that.switch_pause() },
            null);

        var up = [
            function(dt){player.move_up_on(dt)},
            function(dt){player.move_up_off(dt)},
            null];
        var left = [
            function(dt){player.move_left_on(dt)}, 
            function(dt){player.move_left_off(dt)},
            null];
        var down = [
            function(dt){player.move_down_on(dt)}, 
            function(dt){player.move_down_off(dt)},
            null];
        var right = [
            function(dt){player.move_right_on(dt)}, 
            function(dt){player.move_right_off(dt)},
            null];
        // W, K
        bindings.enable.apply(bindings, [87].concat(up));
        bindings.enable.apply(bindings, [75].concat(up));
        // A, H
        bindings.enable.apply(bindings, [65].concat(left));
        bindings.enable.apply(bindings, [72].concat(left));
        // S, J
        bindings.enable.apply(bindings, [83].concat(down));
        bindings.enable.apply(bindings, [74].concat(down));
        // D, L
        bindings.enable.apply(bindings, [68].concat(right));
        bindings.enable.apply(bindings, [76].concat(right));
        // Shift
        bindings.enable(16,
            function(){player.shoot_on()},
            function(){player.shoot_off()},
            function(dt){player.shoot(dt)});
    };

    proto.switch_pause = function() {
        this.pause = !this.pause;
        if (this.pause)
            this.disable_player_bindings();
        else
            this.set_bindings();
    };

    proto.create_some_obstacles = function(count) {
        var world = this.world,
            width = this.width,
            height = this.height;
        for (var i = 0; i < count; i++) {
            var obj = new Obstacle(world),
                x = width + 10,
                y = height * Math.random();
            obj.movement.pos.Set(x, y);
        }
    };
    
    proto.create_spawner = function() {
        var that = this,
            t = new Timer(this.world, 0.4, function() {
            if (Math.random() < 0.2)
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
            obj.damage.groups.push("enemy");
            obj.shooting.shell_group = "enemy";
            m.pos.Set(x + m.size.x, y);
            m.vel.Set(-100 + 40 * Math.random(), 0);
            m.vel_want.SetV(m.vel);
            if (Math.random() < 0.5)
                obj.random_movement = true;
        }
    };

    proto.create_player = function() {
        var world = this.world,
            width = this.width,
            height = this.height,
            player = new DumbUnit(world),
            x = width * Math.random(),
            y = height * Math.random();
        player.damage.regenerate = 0.3;
        player.keep_in_field = true;
        player.shooting.auto_shoot = false;
        player.shooting.recharge_time = 0.05;
        player.shooting.shell_vel.Set(1200, 0);
        player.damage.groups.push("player");
        player.shooting.shell_group = "player";
        player.movement.pos.Set(x, y);
        player.show_energy = true;
        return player;
    };

    proto.create_world = function() {
        var field = [0, 0, this.width, this.height],
            world = new window.World(field);
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
        if (this.pause) return;
        var chandler = this.collision_handler,
            collisions = this.world.get_collisions();
        for (var i = 0, collision; collision = collisions[i]; i++) {
            chandler(dt, collision);
        }
        this.world.step(dt);
    };
    
    proto.draw = function(ctx) {
        this.world.draw_objs()
        ctx.save();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "gray";
        this.world.draw_shapes(ctx)
        ctx.restore();
    };
}();

