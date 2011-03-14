include("b2Vec2.js");

/*
+function() {
    this.Circle = function(world, pos, radius) {
        if (!world) throw "world:World missing";
        if (pos === null) throw "pos:b2Vec2 missing";
        if (radius === null) throw "[radius:float] missing";
        this.world = world;
        this.pos = pos;
        this.radius = radius;
        this.type = "circle";
        this.obj = null;
        this.world.add_shape(this);
    };
    
    Circle.prototype.draw = function(ctx) {
        ctx.save();
        var vec = this.pos;
        ctx.translate(vec.x, vec.y);
        ctx.beginPath();
        ctx.arc(0, 0, this.radius[0], 0, 2*3.14159, false);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    };
}();
*/

+function() {
    // :World, :MovementModel
    this.Rectangle = function(world, m) {
        this.world = world;
        this.pos = m.pos;
        this.size = m.size;
        this.rot = m.rot || [0];
        this.type = "rect";
        this.obj = null;
        this.world.add_shape(this);
    };
    var proto = Rectangle.prototype;
    
    proto.remove = function() {
        this.world.remove_shape(this);
    };
    
    proto.draw = function(ctx) {
        ctx.save();
        var pos = this.pos,
            size = this.size,
            hsize = size.Copy();
        hsize.Multiply(0.5);
        var sx = hsize.x, sy = hsize.y;
        ctx.translate(pos.x, pos.y);
        ctx.rotate(this.rot[0]);
        ctx.beginPath();
        ctx.moveTo(-sx, -sy);
        ctx.lineTo( sx, -sy);
        ctx.lineTo( sx,  sy);
        ctx.lineTo(-sx,  sy);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    };
}();
