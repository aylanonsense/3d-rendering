define([
	'math/SeamedHeightfield'
], function(
	SeamedHeightfield
) {
	function Slope(params) {
		this.heightfield = new SeamedHeightfield(params);
	}
	Slope.prototype.render = function() {
		this.heightfield.render();
	};
	return Slope;
});