include("b2Vec2.js");

(function() {
    this.Obstacle = function(world, pos, size, rot) {
        if (!world) throw "world:World missing";
        this.world = world;
        this.pos = pos || new b2Vec2(0, 0);
        this.size = size || new b2Vec2(10, 10);
        this.rot = rot || [0];
        this.sprite = new Rectangle(world, this.pos, this.size, this.rot);
        this.world.add_obj(this);
    };
})();
