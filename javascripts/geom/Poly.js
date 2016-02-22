define([
	'display/draw',
	'display/camera',
	'geom/Vector3',
	'math/projectVector'
], function(
	draw,
	camera,
	Vector3,
	projectVector
) {
	function Poly(v1, v2, v3, params) {
		this.vectors = [ v1, v2, v3 ];
		this.normal = new Vector3();
		this.color = params && params.color || '#00f';
		this.recalculateNormal();
	}
	Poly.prototype.recalculateNormal = function() {
		var edge1 = this.vectors[0].createVectorTo(this.vectors[1]);
		var edge2 = this.vectors[1].createVectorTo(this.vectors[2]);
		this.normal.set(edge1).cross(edge2).normalize();
	};
	Poly.prototype.render = function() {
		var projections = [
			projectVector(this.vectors[0]),
			projectVector(this.vectors[1]),
			projectVector(this.vectors[2])
		];
		if(this.normal.dot(camera.dir) > 0) {
			draw.poly(projections, { fill: this.color, stroke: '#ccc', thickness: 0.5 });
		}
		else {
			draw.poly(projections, { fill: '#222', stroke: '#555', thickness: 0.5 });
		}
	};
	return Poly;
});