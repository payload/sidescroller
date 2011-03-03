include("b2Vec2.js");

(function() {
    this.World = function(field) {
        this.field = field;
        this.objs = [];
        this.shapes = [];
        this.collide = {
            rect_rect: this.collision_rect_rect
        };
    };
    var proto = World.prototype;
    
    proto.in_field = function(vec) {
        var field = this.field;
        var ret =
            vec.x > field[0] &&
            vec.x < field[2] &&
            vec.y > field[1] &&
            vec.y < field[3];
        return ret;
    };
    
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
    
    proto.remove_obj = function(obj) {
        var i = this.objs.indexOf(obj);
        this.objs.splice(i, 1);
    };
    
    proto.add_shape = function(obj) {
        this.shapes.push(obj);
    };
    
    proto.remove_shape = function(obj) {
        var i = this.shapes.indexOf(obj);
        this.shapes.splice(i, 1);
    };
    
    proto.foreach_obj = function(func) {
        for (var i = 0, obj; obj = this.objs[i]; i++)
            func(obj);
    };
    
    proto.foreach_shape = function(func) {
        for (var i = 0, obj; obj = this.shapes[i]; i++)
            func(obj);
    };
})();
