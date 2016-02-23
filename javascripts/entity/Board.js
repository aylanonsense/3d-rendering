define([
	'entity/Entity',
	'util/extend',
	'display/draw',
	'math/projectVector',
	'geom/Vector3',
	'input/keyboard'
], function(
	Entity,
	extend,
	draw,
	projectVector,
	Vector3,
	keyboard
) {
	var FORWARD_FRICTION = 0.00001;
	var SIDEWAYS_FRICTION = 0.035;
	function Board(params) {
		Entity.call(this, extend(params, {
			gravityY: -120,
			bounce: 0,
			friction: 0
		}));
		this.boardAngle = 0.0;
		this.boardLength = 40;
	}
	Board.prototype = Object.create(Entity.prototype);
	Board.prototype.endOfFrame = function(t) {
		Entity.prototype.endOfFrame.apply(this, arguments);

		//turn board
		var keys = keyboard.getState();
		if(keys.LEFT && !keys.RIGHT) {
			this.boardAngle -= 2 * t;
		}
		else if(keys.RIGHT && !keys.LEFT) {
			this.boardAngle += 2 * t;
		}

		//apply friction
		if(this.latestCollision) {
			//remove velocity orthogonal to the collision plane
			var velNormal = this.vel.clone().proj(this.latestCollision.normal);
			this.vel.subtract(velNormal); //all that's left is velocity parallel to the plane

			//find the actual direction of the board on the plane
			var boardDirX = Math.sin(this.boardAngle);
			var boardDirZ = Math.cos(this.boardAngle);
			var boardFrontHeight = this.latestCollision.poly.findHeightAt(this.pos.x + boardDirX, this.pos.z + boardDirZ);
			var boardPlanarDir = (new Vector3(boardDirX, boardFrontHeight - this.pos.y, boardDirZ)).normalize();

			//apply friction to the sideways component of the motion
			var motionForward = this.vel.clone().proj(boardPlanarDir);
			this.vel.subtract(motionForward).multiply(1 - SIDEWAYS_FRICTION);

			//add back the other components of the velocity (unaffected)
			motionForward.multiply(1 - FORWARD_FRICTION);
			this.vel.add(motionForward).add(velNormal);
		}
	};
	Entity.prototype.render = function() {
		var boardDirX = Math.sin(this.boardAngle);
		var boardDirZ = Math.cos(this.boardAngle);
		var front = projectVector(this.pos.x + this.boardLength / 2 * boardDirX,
			this.pos.y, this.pos.z + this.boardLength / 2 * boardDirZ);
		var back = projectVector(this.pos.x - this.boardLength / 2 * boardDirX,
			this.pos.y, this.pos.z - this.boardLength / 2 * boardDirZ);
		draw.line(front, back, { stroke: (this.latestCollision ? '#f00' : '#00f'), thickness: 6 });
	};
	return Board;
});