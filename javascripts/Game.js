define([
	'global',
	'display/camera',
	'math/Vector3',
	'display/draw',
	'math/projectVector',
	'entity/Slope'
], function(
	global,
	camera,
	Vector3,
	draw,
	projectVector,
	Slope
) {
	function Game() {
		var matrix = [];
		for(var c = 0; c < 10; c++) {
			matrix[c] = [];
			for(var r = 0; r < 10; r++) {
				if(c === 5 && r === 6) {
					matrix[c][r] = {
						default: 5,//10 * (Math.cos(c) + Math.sin(r)),
						upperLeft: 20,
						upperRight: 20
					};
				}
				else {
					matrix[c][r] = 10 * (Math.cos(c) + Math.sin(r));
				}
			}
		}
		this.entities = [
			new Slope({
				matrix: matrix,
				lightDir: new Vector3(-5, -10, -7),
				// cols: 10,
				// rows: 10,
				tileWidth: 30,
				tileLength: 30,
				// height: 20,
				pos: new Vector3(0, 0, 0)
			})
		];
		this.time = 0;
	}
	Game.prototype.update = function(t) {
		this.time += t;
		/*camera.pos.x = 20 * Math.cos(this.time / 3);
		camera.pos.y = 20;
		camera.pos.z = 20 * Math.sin(this.time / 3);
		camera.dir.x = -camera.pos.x;
		camera.dir.y = -camera.pos.y;
		camera.dir.z = -camera.pos.z;
		camera.pos.x += 150;
		camera.pos.z += 150;*/
	};
	Game.prototype.render = function() {
		//adjust camera
		camera.calcUnitVectors();

		//clear bg
		draw.rect(-global.CANVAS_WIDTH / 2, -global.CANVAS_HEIGHT / 2,
			global.CANVAS_WIDTH, global.CANVAS_HEIGHT, { fill: '#000', fixed: true });

		//draw axes (x axis is RED, y axis is GREEN, z axis is BLUE, all pointing in the positive direction)
		var origin = projectVector(0, 0, 0);
		var xAxis = projectVector(100, 0, 0);
		var yAxis = projectVector(0, 100, 0);
		var zAxis = projectVector(0, 0, 100);
		draw.line(origin.x, origin.y, xAxis.x, xAxis.y, { stroke: '#f00', thickness: 3 });
		draw.line(origin.x, origin.y, yAxis.x, yAxis.y, { stroke: '#0f0', thickness: 3 });
		draw.line(origin.x, origin.y, zAxis.x, zAxis.y, { stroke: '#00f', thickness: 3 });

		//draw entities
		for(var i = 0; i < this.entities.length; i++) {
			this.entities[i].render();
		}
	};
	return Game;
});