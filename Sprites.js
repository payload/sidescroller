include("b2Vec2.js");

(function() {
    this.Circle = function(world, pos, radius) {
        if (!world) throw "world:World missing";
        if (pos === null) throw "pos:b2Vec2 missing";
        if (radius === null) throw "[radius:float] missing";
        this.world = world;
        this.pos = pos;
        this.radius = radius;
        this.type = "circle";
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
})();

(function() {
    this.Rectangle = function(world, pos, size, rot) {
        if (!world) throw "world:World missing";
        if (!pos) throw "pos:b2Vec2() missing";
        if (!size) throw "size:b2Vec2() missing";
        this.world = world;
        this.pos = pos;
        this.size = size;
        this.rot = rot || [0];
        this.type = "rectangle";
        this.world.add_shape(this);
    };
    
    Rectangle.prototype.draw = function(ctx) {
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
})();
