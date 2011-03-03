(function() {
    this.Map = function(world) {
        if (!world) throw "world:World missing";
        this.world = world;
    };
    var proto = Map.prototype;
    
    proto.step = function(dt) {
    };
})();
