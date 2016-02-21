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
		this.entities = [
			new Slope({
				cols: 10,
				rows: 10,
				tileWidth: 20,
				tileLength: 20,
				pos: new Vector3(0, 0, 0),
				height: 20,
			})
		];
		this.time = 0;
	}
	Game.prototype.update = function(t) {};
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