define([
	'global',
	'display/draw',
	'display/camera',
	'geom/Vector3',
	'math/projectVector',
	'level/Slope',
	'entity/Player'
], function(
	global,
	draw,
	camera,
	Vector3,
	projectVector,
	Slope,
	Player
) {
	function Game() {
		this.time = 0;

		//create slopes
		var matrix = [];
		for(var c = 0; c < 15; c++) {
			matrix[c] = [];
			for(var r = 0; r < 15; r++) {
				// if(c === 5 && r === 6) {
					// matrix[c][r] = { default: 5, upperLeft: 20, upperRight: 20 };
				// }
				// else {
					matrix[c][r] = 10 + 7 * (Math.cos(1.5 * c) + Math.sin(1.5 * r));
				// }
			}
		}
		this.slopes = [
			new Slope({
				matrix: matrix,
				lightDir: new Vector3(-6, -10, -4),
				// cols: 10,
				// rows: 10,
				tileWidth: 20,
				tileLength: 20
				// height: 20,
			})
		];

		//create entities
		this.entities = [
			new Player({
				game: this,
				x: 100,
				y: 100,
				z: 100
			})
		];
	}
	Game.prototype.update = function(t) {
		var i;
		this.time += t;

		//adjust camera
		camera.pos.x = 20 * Math.cos(this.time / 3);
		camera.pos.y = 20;
		camera.pos.z = 20 * Math.sin(this.time / 3);
		camera.dir.x = -camera.pos.x;
		camera.dir.y = -camera.pos.y;
		camera.dir.z = -camera.pos.z;
		camera.pos.x += 150;
		camera.pos.z += 150;

		//update entities
		for(i = 0; i < this.entities.length; i++) {
			this.entities[i].update(t);
		}
	};
	Game.prototype.render = function() {
		var i;

		//recalculate camera mathy stuff
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

		//draw level
		for(i = 0; i < this.slopes.length; i++) {
			this.slopes[i].render();
		}

		//draw entities
		for(i = 0; i < this.entities.length; i++) {
			this.entities[i].render();
		}
	};
	return Game;
});