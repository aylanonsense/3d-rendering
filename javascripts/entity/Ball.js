define([
	'entity/Entity',
	'util/extend'
], function(
	Entity,
	extend
) {
	function Ball(params) {
		Entity.call(this, extend(params, {
			gravityY: -100,
			bounce: 0.2,
			friction: 0.001
		}));
	}
	Ball.prototype = Object.create(Entity.prototype);
	return Ball;
});