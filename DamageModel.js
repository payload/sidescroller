+function() {
    this.DamageModel = function(){
        this.energy = 0;
        this.max_energy = 0;
        this.factor = 1;
        this.to_apply = 0;
        this.regenerate = 0;
        this.groups = [];
        this.die = function(){};
    };
    var proto = DamageModel.prototype;

    proto.step = function(dt) {
        if (this.regenerate === 0) return;
        if (this.energy < this.max_energy) {
            this.energy = Math.min(
                this.energy + this.regenerate * dt,
                this.max_energy);
        }
    };
    
    proto.check_group = function(a, b) {
        for (var i = 0, g; g = a[i]; i++)
            if (b.indexOf(g) >= 0)
                return true;
        return false;
    };
    
    proto.apply_damage = function(dt, dmg, to_apply) {
        if (this.check_group(this.groups, dmg.groups)) return false;
        dmg.energy -= to_apply * dmg.factor * dt;
        if (dmg.energy < 0)
            dmg.die(this);
        return true;
    };
    
    proto.collide = function(dt, dmg, coll) {
        return this.apply_damage(dt, dmg, this.to_apply);
    };
    
    proto.explode = function(other, damage) {
        return this.apply_damage(1, other, damage);
    };
}();

