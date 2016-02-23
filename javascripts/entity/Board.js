define([
	'entity/Entity',
	'util/extend',
	'display/draw',
	'math/projectVector',
	'geom/Vector3'
], function(
	Entity,
	extend,
	draw,
	projectVector,
	Vector3
) {
	var FORWARD_FRICTION = 0.0001;
	var SIDEWAYS_FRICTION = 0.01;
	function Board(params) {
		Entity.call(this, extend(params, {
			gravityY: -100,
			bounce: 0,
			friction: 0
		}));
		this.boardDir = new Vector3(0, 0, 1);
		this.boardLength = 16;
	}
	Board.prototype = Object.create(Entity.prototype);
	Board.prototype.endOfFrame = function(t) {
		Entity.prototype.endOfFrame.apply(this, arguments);
		if(this.latestCollision) {
			//remove velocity orthogonal to the collision plane
			var velNormal = this.vel.clone().proj(this.latestCollision.normal);
			this.vel.subtract(velNormal); //all that's left is velocity parallel to the plane

			//find the actual direction of the board on the plane
			var boardFrontHeight = this.latestCollision.poly.findHeightAt(this.pos.x + this.boardDir.x, this.pos.z + this.boardDir.z);
			var boardPlanarDir = (new Vector3(this.boardDir.x, boardFrontHeight - this.pos.y, this.boardDir.z)).normalize();

			//apply friction to the sideways component of the motion
			var motionForward = this.vel.clone().proj(boardPlanarDir);
			this.vel.subtract(motionForward).multiply(1 - SIDEWAYS_FRICTION);

			//add back the other components of the velocity (unaffected)
			motionForward.multiply(1 - FORWARD_FRICTION);
			this.vel.add(motionForward).add(velNormal);
		}
	};
	Entity.prototype.render = function() {
		var front = projectVector(this.pos.x + this.boardLength / 2 * this.boardDir.x,
			this.pos.y, this.pos.z + this.boardLength / 2 * this.boardDir.z);
		var back = projectVector(this.pos.x - this.boardLength / 2 * this.boardDir.x,
			this.pos.y, this.pos.z - this.boardLength / 2 * this.boardDir.z);
		draw.line(front, back, { stroke: '#00f', thickness: 4 });
	};
	return Board;
});