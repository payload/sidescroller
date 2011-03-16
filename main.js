var include = function(file) {
    var args = 'type="text/javascript" src="'+file+'"';
    document.write('<script '+args+'></script>');
};
include("foo.js");
include("b2Vec2.js");
include("Game.js");
include("FlyingObject.js");
include("World.js");
include("Obstacle.js");
include("Units.js");
include("Sprites.js");
include("ShootingModel.js");
include("Shell.js");
include("DamageModel.js");
include("MovementModel.js");
include("Timer.js");

function inherit(a, b) {
    a.prototype = new b();
    a.prototype.constructor = a;
    return a;
}
