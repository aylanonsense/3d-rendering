define([
	'display/camera',
	'math/Vector3',
	'math/Vector'
], function(
	camera,
	Vector3,
	Vector
) {
	return function projectVector(x, y, z) {
		if(arguments.length === 1) { z = x.z; y = x.y; x = x.x; }
		var zAxis = camera.dir.clone().normalize();
		var yAxis = (new Vector3(0, -1, 0)).proj(zAxis).add(0, 1, 0).normalize();
		var xAxis = zAxis.clone().cross(yAxis).normalize();
		var u = (new Vector3(x, y, z)).subtract(camera.pos);
		u = u.createVectorTo(0, 0, 0).proj(zAxis).add(u);
		return new Vector(u.dot(xAxis), u.dot(yAxis));
	};
});