+function() {
    var Obstacle = function(world) {
        this.init(world);
        this.movement.size.Set(10, 10);
        var dmg = this.damage;
        dmg.energy = 0;
        dmg.to_apply = 30;
        dmg.factor = 0;
        dmg.die = function(){};
    };
    this.Obstacle = inherit(Obstacle, FlyingObject);
}();
