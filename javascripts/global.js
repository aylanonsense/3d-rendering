define({
	//rendering/canvas
	RENDER: true,
	CANVAS_WIDTH: 600,
	CANVAS_HEIGHT: 400,

	//input
	KEY_BINDINGS: {
		38: 'UP', 87: 'UP', //up arrow key / w key
		37: 'LEFT', 65: 'LEFT', //left arrow key / a key
		40: 'DOWN', 83: 'DOWN', //down arrow key / s key
		39: 'RIGHT', 68: 'RIGHT' //right arrow key / d key
	},

	//frame rate
	CONSTANT_TIME_PER_FRAME: false,
	FRAMES_PER_SECOND: null, //null will use requestAnimationFrame
	TIME_SCALE: 1.0, //2.0 will run twice as fast, 0.5 will run at half speed
});