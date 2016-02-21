define([
	'math/Heightfield'
], function(
	Heightfield
) {
	function Slope(params) {
		this.heightfield = new Heightfield(params);
	}
	Slope.prototype.render = function() {
		this.heightfield.render();
	};
	return Slope;
});