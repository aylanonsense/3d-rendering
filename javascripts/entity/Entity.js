define([
	'display/draw',
	'math/projectVector',
	'geom/Vector3'
], function(
	draw,
	projectVector,
	Vector3
) {
	function Entity(params) {
		this.game = params.game;
		this.pos = params.pos ? params.pos : new Vector3(params.x, params.y, params.z);
		this.prevPos = this.pos.clone();
		this.vel = params.vel ? params.vel : new Vector3(params.velX, params.velY, params.velZ);
		this.gravity = params.gravity ? params.gravity : new Vector3(params.gravityX, params.gravityY, params.gravityZ);
	}
	Entity.prototype.update = function(t) {
		this.prevPos.set(this.pos);
		this.vel.addMult(this.gravity, t);
		this.pos.addMult(this.vel, t);

		//check for intersections with slopes
		for(var i = 0; i < this.game.slopes.length; i++) {
			var slope = this.game.slopes[i];
			var collision = slope.findCollisionWithEntity(this);
			if(collision && this.vel.y < 0) {
				this.pos.y = collision.y;
				this.vel.y *= -1;
			}
		}
	};
	Entity.prototype.render = function() {
		var v = projectVector(this.pos);
		draw.circle(v.x, v.y, 5, { fill: '#ccc', stroke: '#666', thickness: 1 });
	};
	return Entity;
});