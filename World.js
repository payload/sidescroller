include("b2Vec2.js");

(function() {
    this.World = function() {
        this.objs = [];
        this.shapes = [];
        this.bodies = [];
        this.collide = {
            rect_rect: this.collision_rect_rect
        };
    };
    var proto = World.prototype;
    
    proto.collision_rect_rect = function(a, b) {
        var posa = a.pos;
        var posb = b.pos;
        var diff = posb.Copy();
        diff.Subtract(posa);
        var distance = diff.Length();
        var min_distance = a.size.Length()*0.5 + b.size.Length()*0.5;
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
    
    proto.get_collisions = function() {
        var shapes = this.shapes,
            collide = this.collide,
            collisions = [];
        for (var i = 0, a; a = shapes[i]; i++) {
            for (var j = i+1, b; b = shapes[j]; j++) {
                if (a.type < b.type) {
                    var c = b; b = a; a = c;
                }
                var collision_type = a.type +"_"+ b.type;
                var collide_f = collide[collision_type];
                if (!collide_f) continue;
                var collision = collide_f(a,b);
                if (collision) collisions.push(collision);
            }
        }
        return collisions;
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
