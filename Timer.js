+function(){
    this.Timer = function(world, interval, callback){
        this.interval = interval === undefined ? 1 : interval;
        this.running = true;
        this.accum = 0;
        this.callback = callback || null;
        world.add_timer(this);
    };   
    var proto = Timer.prototype;
    
    proto.start = function() {
        this.running = true;
    };
    
    proto.stop = function() {
        this.running = false;
        this.accum = 0;
    };
    
    proto.pause = function() {
        this.running = false;
    };
    
    proto.restart = function() {
        this.running = true;
        this.accum = 0;
    };
    
    proto.step = function(dt) {
        if (!this.running) return;
        this.accum += dt;
        if (this.accum >= this.interval) {
            while (this.accum >= this.interval)
                this.accum = this.interval - this.accum;
            if (this.callback)
                this.callback();
        }
    };
}();
