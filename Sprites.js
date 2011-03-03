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
        this.rot = rot || 0;
        this.type = "rectangle";
        this.world.add_shape(this);
    };
    
    Rectangle.prototype.draw = function(ctx) {
        ctx.save();
        var pos = this.pos;
        var size = this.size;
        ctx.translate(pos.x, pos.y);
        ctx.rotate(this.rot[0]);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(size.x, 0);
        ctx.lineTo(size.x, size.y);
        ctx.lineTo(0, size.y);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    };
})();
