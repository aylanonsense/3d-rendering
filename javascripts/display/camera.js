define([
	'geom/Vector3'
], function(
	Vector3
) {
	return {
		pos: new Vector3(400, 0, 0),
		dir: new Vector3(0.4, -0.4, -1),
		zoom: 0.5,

		//mathy stuffs:
		xUnit: new Vector3(0, 0, 0), //red (-x: left, +x: right)
		yUnit: new Vector3(0, 0, 0), //green (-y: down, +y: up)
		zUnit: new Vector3(0, 0, 0), //blue (-z: away from camera, +z: towards camera)
		calcUnitVectors: function() {
			this.zUnit.set(this.dir).normalize();
			this.yUnit.set(0, 1, 0).proj(this.zUnit).add(0, -1, 0).normalize();
			this.xUnit.set(this.yUnit).cross(this.zUnit).normalize();
		}
	};
});