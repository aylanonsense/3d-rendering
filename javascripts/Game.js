define([
	'global',
	'display/camera',
	'math/Vector3',
	'math/Vector',
	'display/draw'
], function(
	global,
	camera,
	Vector3,
	Vector,
	draw
) {
	function Game() {
		this.time = 0;
		this.blips = [
			{
				pos: new Vector3(0, 0, 0),
				vel: new Vector3(1, 0, 0),
				color: '#f00'
			},
			{
				pos: new Vector3(0, 0, 0),
				vel: new Vector3(0, 1, 0),
				color: '#0f0'
			},
			{
				pos: new Vector3(0, 0, 0),
				vel: new Vector3(0, 0, 1),
				color: '#00f'
			}
		];
	}
	Game.prototype.update = function(t) {
		this.time += t;
		camera.pos.y = 5;
		camera.pos.x = 5 * Math.cos(this.time);
		camera.pos.z = 5 * Math.sin(this.time);
		camera.dir.x = -camera.pos.x;
		camera.dir.y = -camera.pos.y;
		camera.dir.z = -camera.pos.z;
		camera.dir.normalize();
		for(var i = 0; i < this.blips.length; i++) {
			this.blips[i].pos.addMult(this.blips[i].vel, 10 * t);
		}
	};
	Game.prototype.render = function() {
		draw.rect(-global.CANVAS_WIDTH / 2, -global.CANVAS_HEIGHT / 2,
			global.CANVAS_WIDTH, global.CANVAS_HEIGHT, { fill: '#000', fixed: true });
		var origin = projectVector(new Vector3(0, 0, 0));
		var originX = projectVector(new Vector3(100, 0, 0));
		var originY = projectVector(new Vector3(0, 100, 0));
		var originZ = projectVector(new Vector3(0, 0, 100));
		draw.circle(origin.x, origin.y, 2, { fill: '#fff' });
		//x axis is RED and should be pointing RIGHT (+)
		//y axis is GREEN and should be pointing DOWN (+)
		//z axis is BLUE and should be pointing TOWARDS the camera (+)
		draw.line(origin.x, origin.y, originX.x, originX.y, { stroke: '#f00', thickness: 3 });
		draw.line(origin.x, origin.y, originY.x, originY.y, { stroke: '#0f0', thickness: 3 });
		draw.line(origin.x, origin.y, originZ.x, originZ.y, { stroke: '#00f', thickness: 3 });
		for(var i = 0; i < this.blips.length; i++) {
			var pos = projectVector(this.blips[i].pos);
			draw.circle(pos.x, pos.y, 5, { fill: this.blips[i].color });
		}
	};

	//helper methods
	function projectVector(v) {
		var zAxis = camera.dir.clone().normalize();
		var yAxis = (new Vector3(0, -1, 0)).proj(zAxis).add(0, 1, 0).normalize();
		var xAxis = zAxis.clone().cross(yAxis).normalize();
		var u = v.clone().subtract(camera.pos);
		u = u.createVectorTo(0, 0, 0).proj(zAxis).add(u);
		return new Vector(u.dot(xAxis), u.dot(yAxis));
	}

	return Game;
});