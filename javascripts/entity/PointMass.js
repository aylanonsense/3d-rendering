define([
	'display/draw',
	'math/projectVector',
	'geom/Vector3'
], function(
	draw,
	projectVector,
	Vector3
) {
	function PointMass(params) {
		this.pos = new Vector3();
		this.vel = new Vector3();
	}
	PointMass.prototype.update = function(t) {
		this.pos.addMult(this.vel, t);
	};
	PointMass.prototype.render = function() {
		var v = projectVector(this.pos);
		draw.cirlce(v.x, v.y, 5, { fill: '#f00' });
	};
	return PointMass;
});