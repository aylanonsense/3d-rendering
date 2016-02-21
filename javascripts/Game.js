define([
	'global',
	'display/camera',
	'math/Vector3',
	'math/Vector',
	'display/draw',
	'math/projectVector',
	'math/Heightfield'
], function(
	global,
	camera,
	Vector3,
	Vector,
	draw,
	projectVector,
	Heightfield
) {
	function Game() {
		this.entities = [];
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
		this.entities.push(new Heightfield({
			cols: 10,
			rows: 10,
			tileWidth: 20,
			tileLength: 20,
			pos: new Vector3(-50, 0, -50),
			height: 20,
		}));
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
		for(i = 0; i < this.entities.length; i++) {
			this.entities[i].render();
		}
	};
	return Game;
});