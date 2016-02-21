define([
	'math/Vector3'
], function(
	Vector3
) {
	return {
		//-x: left, +x: right
		//-y: up, +y: down
		//-z: away from camera, +z: towards camera
		pos: new Vector3(0, 0, 1),
		dir: new Vector3(0, 0, -1),
		zoom: 1
	};
});