define([
	'global',
	'display/draw',
	'display/camera',
	'geom/Vector3',
	'math/projectVector',
	'level/Slope',
	'entity/Board'
], function(
	global,
	draw,
	camera,
	Vector3,
	projectVector,
	Slope,
	Board
) {
	function Game() {
		var c, r;
		this.time = 0;

		//create slopes
		var matrix = [];
		for(r = 0; r < 50; r++) {
			matrix[r] = [];
			for(c = 0; c < 12; c++) {
				var h = 50 * 10 - 10 * r;
				h -= 20 * Math.sin(2 * Math.PI * (c + 10) / 12);
				if(r + c < 28) {
					h += 40 + 2 * c;
				}
				h += 3 * Math.abs(c - 6) * Math.random();
				if((c < 1 && r < 11) || (c < 2 && r < 3) || (c > 10 && r > 10 && r < 35) ||
					(c > 9 && r > 20 && r < 30) || (c < 1 && r > 35)) {
					h = null;
				}
				matrix[r][c] = h;
			}
		}
		this.slopes = [
			new Slope({
				matrix: matrix,
				lightDir: new Vector3(-6, -10, -4),
				// cols: 3,
				// rows: 4,
				// height: 20,
				tileWidth: 30,
				tileLength: 30
			})
		];

		//create entities
		this.entities = [];
		for(c = 0; c < 10; c++) {
			for(r = 0; r < 10; r++) {
				this.entities.push(new Board({
					game: this,
					x: 150 + 100 * Math.random(),
					y: 100,
					z: 150 + 100 * Math.random()
				}));
			}
		}
	}
	Game.prototype.update = function(t) {
		var i;
		this.time += t;

		//adjust camera
		/*camera.pos.x = 20 * Math.cos(this.time / 7);
		camera.pos.y = 10;
		camera.pos.z = 20 * Math.sin(this.time / 7);
		camera.dir.x = -camera.pos.x;
		camera.dir.y = -camera.pos.y;
		camera.dir.z = -camera.pos.z;
		camera.pos.x += 200;
		camera.pos.z += 200;*/

		//update entities
		for(i = 0; i < this.entities.length; i++) {
			this.entities[i].startOfFrame(t);
		}
		for(i = 0; i < this.entities.length; i++) {
			this.entities[i].update(t);
		}
		for(i = 0; i < this.entities.length; i++) {
			this.entities[i].endOfFrame(t);
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