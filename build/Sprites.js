(function() {
  var Rectangle;
  window.Rectangle = Rectangle = (function() {
    function Rectangle(world, obj) {
      var m;
      this.world = world;
      this.obj = obj;
      m = this.obj.movement;
      this.pos = m.pos;
      this.size = m.size;
      this.rot = m.rot || [0];
      this.type = "rect";
      this.obj || (this.obj = null);
      this.style = {
        stroke: [0.5, 0.5, 0.5, 1.0],
        fill: [0.88, 0.88, 0.88, 1.0]
      };
      this.world.add_shape(this);
    }
    Rectangle.prototype.remove = function() {
      return this.world.remove_shape(this);
    };
    Rectangle.prototype.draw = function(ctx) {
      var h, pos, size, w;
      ctx.save();
      pos = this.pos;
      size = this.size;
      w = size.x;
      h = size.y;
      ctx.translate(pos.x, pos.y);
      ctx.rotate(this.rot[0]);
      ctx.beginPath();
      ctx.rect(-w / 2, -h / 2, w, h);
      ctx.closePath();
      if (this.style.fill !== null) {
        ctx.fillStyle = this.color_to_css(this.style.fill);
        ctx.fill();
      }
      if (this.style.stroke !== null) {
        ctx.strokeStyle = this.color_to_css(this.style.stroke);
        ctx.stroke();
      }
      return ctx.restore();
    };
    Rectangle.prototype.color_to_css = function(color) {
      var a, b, g, r;
      r = Math.round(color[0] * 255);
      g = Math.round(color[1] * 255);
      b = Math.round(color[2] * 255);
      a = color[3];
      return "rgba(" + r + "," + g + "," + b + "," + a + ")";
    };
    return Rectangle;
  })();
}).call(this);
