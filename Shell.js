+function() {
    var Shell = function(world) {
        var that = this;
        this.init(world);
        this.movement.size.Set(5, 5);
        this.damage.die = function(other) {
            if (this.groups.indexOf('player') >= 0
                && other.groups.indexOf('enemy') >= 0)
                that.world.inc_score();
            that.remove();
            this.explode(other, 1);
        };
    };
    this.Shell = inherit(Shell, FlyingObject);
}();
