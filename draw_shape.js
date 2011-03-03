var draw_shape = function(ctx, shape) {
    var type = shape.GetType();
    if (type == b2Shape.e_circleShape)
        draw_circle(ctx, shape);
    else
        draw_poly(ctx, shape);
};

var transform_by_shape = function(ctx, shape) {
    var vec = shape.GetPosition();
    var rot = shape.GetRotationMatrix().col1;
    rot = Math.atan2(rot.y, rot.x);
    ctx.translate(vec.x, vec.y);
    ctx.rotate(rot);
};

var draw_circle = function(ctx, circle) {
    ctx.save();
    transform_by_shape(ctx, circle);
    ctx.beginPath();
    ctx.arc(0, 0, circle.GetMaxRadius(), 0, 2*3.14159, false);
    ctx.closePath();
    ctx.restore();
};

var draw_poly = function(ctx, poly) {
    ctx.save();
    
    transform_by_shape(ctx, poly);    
    var vertices = poly.m_vertices;
    var vec = vertices[0];
    ctx.beginPath();
    ctx.moveTo(vec.x, vec.y);
    for (var i = 1; vec = vertices[i]; i++)
        ctx.lineTo(vec.x, vec.y);
    ctx.closePath();
    ctx.restore();
};
