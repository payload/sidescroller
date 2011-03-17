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
        this.style = {
            stroke: [0.5, 0.5, 0.5, 1.0],
            fill: null
        };
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
        if (this.style.stroke !== null) {
            ctx.strokeStyle = this.color_to_css(this.style.stroke);
            ctx.stroke();
        }
        if (this.style.fill !== null) {
            ctx.fillStyle = this.color_to_css(this.style.fill);
            ctx.fill();
        }
        ctx.restore();
    };
    
    proto.color_to_css = function(color) {
        var r = Math.round(color[0] * 255),
            g = Math.round(color[1] * 255),
            b = Math.round(color[2] * 255),
            a = color[3];
        return "rgba("+r+","+g+","+b+","+a+")";
    };
}();
