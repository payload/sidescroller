var include = function(file, path) {
	if (!path) path = 'build/'
    var args = 'type="text/javascript" src="'+path+file+'"';
    document.write('<script '+args+'></script>');
};
var toinc = ["foo.js", "Game.js", "FlyingObject.js", "World.js",
	"Units.js", "Sprites.js", "ShootingModel.js", "Shell.js",
	"DamageModel.js", "MovementModel.js", "Timer.js", "Obstacle.js"];
for (var i in toinc) include(toinc[i]);
include("b2Vec2.js", "js/");