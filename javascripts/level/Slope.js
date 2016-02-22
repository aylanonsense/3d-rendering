define([
	'geom/SeamedHeightfield'
], function(
	SeamedHeightfield
) {
	function Slope(params) {
		this.heightfield = new SeamedHeightfield(params);
	}
	Slope.prototype.render = function() {
		this.heightfield.render();
	};
	Slope.prototype.findCollisionWithEntity = function(entity) {
		return this.heightfield.findCollisionWithEntity.apply(this.heightfield, arguments);
	};
	return Slope;
});