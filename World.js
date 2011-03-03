include("b2Vec2.js");

(function() {
    this.World = function() {
        this.objs = [];
        this.shapes = [];
        this.bodies = [];
        this.collide = {
            circle_rectangle: this.collision_circle_rectangle
        };
    };
    var proto = World.prototype;
    
    proto.collision_circle_rectangle = function(a, b) {
        var posa = a.pos;
        var posb = b.pos;
        var diff = posb.Copy();
        diff.Subtract(posa);
        var distance = diff.Length();
        var min_distance = a.radius[0] + b.size.Length();
        if (distance < min_distance)
            return {
                a: a,
                b: b,
                diff: diff,
                distance: distance,
                min_distance: min_distance
            };
        return null;
    };
    
    proto.collision_handler = function(coll) {
        if (!coll.a.obj || !coll.b.obj) return;
    };
    
    proto.step = function(dt) {
        var that = this;
        var collisions = [];
        this.foreach_shape( function(a) {
        that.foreach_shape( function(b) {
            if (a === b) return;
            var collision_type = a.type +"_"+ b.type;
            var collide = that.collide[collision_type];
            if (!collide) return;
            var collision = collide(a,b);
            if (collision) collisions.push(collision);
        })});
        for (var i = 0, collision; collision = collisions[i]; i++) {
            this.collision_handler(collision);
        }
    };
    
    proto.add_obj = function(obj) {
        this.objs.push(obj);
    };
    
    proto.add_shape = function(obj) {
        this.shapes.push(obj);
    };
    
    proto.add_body = function(obj) {
        this.bodies.push(obj);
    };
    
    proto.foreach_obj = function(func) {
        for (var i = 0, obj; obj = this.objs[i]; i++)
            func(obj);
    };
    
    proto.foreach_shape = function(func) {
        for (var i = 0, obj; obj = this.shapes[i]; i++)
            func(obj);
    };
    
    proto.foreach_body = function(func) {
        for (var i = 0, obj; obj = this.bodies[i]; i++)
            func(obj);
    };
})();
