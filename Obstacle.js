+function() {
    var Obstacle = function(world) {
        this.init(world);
        
        var m = this.movement,
            dmg = this.damage;

        m.size.Set(10, 10);
        m.vel.Set(-160 + 40 * Math.random(), 0);
        m.vel_want.SetV(m.vel);

        dmg.energy = 0;
        dmg.to_apply = 30;
        dmg.factor = 0;
        dmg.die = function(){};
    };
    this.Obstacle = inherit(Obstacle, FlyingObject);
}();
