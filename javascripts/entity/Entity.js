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
		this.bounce = typeof params.bounce === 'number' ? params.bounce : 1;
		this.friction = typeof params.friction === 'number' ? params.friction : 0.005;
		this.latestCollision = null;
	}
	Entity.prototype.startOfFrame = function(t) {
		this.latestCollision = null;
	};
	Entity.prototype.update = function(t) {
		//basic physics
		this.prevPos.set(this.pos);
		this.vel.addMult(this.gravity, t);
		this.pos.addMult(this.vel, t);
		this.vel.multiply(1 - this.friction);

		//check for intersections with slopes
		for(var i = 0; i < this.game.slopes.length; i++) {
			var slope = this.game.slopes[i];
			var collision = slope.findCollisionWithEntity(this);
			if(collision && this.pos.y < collision.y) {
				//reflect the velocity about the normal of the surface
				if(this.vel.dot(collision.normal) >= 0) {
					this.handleCollision(collision);
				}
				else {
					//entity is heading upwards from beneath the slope
				}
			}
		}
	};
	Entity.prototype.handleCollision = function(collision) {
		this.pos.y = collision.y;
		var normalVel = this.vel.clone().proj(collision.normal);
		this.vel.subtract(normalVel);
		this.vel.addMult(normalVel, -this.bounce);
		this.latestCollision = collision;
	};
	Entity.prototype.endOfFrame = function(t) {};
	Entity.prototype.render = function() {
		var v = projectVector(this.pos);
		draw.circle(v.x, v.y - 1, 2, { fill: '#f00', stroke: '#700', thickness: 1 });
	};
	return Entity;
});