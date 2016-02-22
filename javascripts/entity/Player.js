define([
	'entity/Entity',
	'util/extend'
], function(
	Entity,
	extend
) {
	function Player(params) {
		Entity.call(this, extend(params, {
			gravityY: -100
		}));
	}
	Player.prototype = Object.create(Entity.prototype);
	Player.prototype.update = function(t) {
		Entity.prototype.update.apply(this, arguments);
	};
	Player.prototype.render = function() {
		Entity.prototype.render.apply(this, arguments);
	};
	return Player;
});