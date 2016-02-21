define([
	'global'
], function(
	global
) {
	if(global.RENDER) {
		var canvas = document.getElementById("canvas");
		canvas.setAttribute("width", global.CANVAS_WIDTH);
		canvas.setAttribute("height", global.CANVAS_HEIGHT);
		return canvas;
	}
	else {
		return null;
	}
});