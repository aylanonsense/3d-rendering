define([
	'display/camera'
], function(
	camera
) {
	//this is just some crazy math to project a 3D vector othographically onto the 2D plane of the camera
	// it's hard to read because it gets run a bunch of times every frame so I optimized it
	return function projectVector(x, y, z) {
		if(arguments.length === 1) { z = x.z; y = x.y; x = x.x; }
		var p = camera.pos, n = camera.zUnit;
		var c = n.x * (p.x - x) + n.y * (p.y - y) + n.z * (p.z - z);
		c /= n.x * n.x + n.y * n.y + n.z * n.z;
		x += n.x * c - p.x;
		y += n.y * c - p.y;
		z += n.z * c - p.z;
		return {
			x: x * camera.xUnit.x + y * camera.xUnit.y + z * camera.xUnit.z,
			y: x * camera.yUnit.x + y * camera.yUnit.y + z * camera.yUnit.z
		};
	};
});