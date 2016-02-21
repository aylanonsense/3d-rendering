define([
	'global',
	'display/canvas',
	'display/camera'
], function(
	global,
	canvas,
	camera
) {
	var DEFAULT_FILL_COLOR = '#fff';
	var DEFAULT_STROKE_COLOR = '#fff';

	var ctx;
	if(global.RENDER) {
		ctx = canvas.getContext("2d");
		ctx.fillStyle = DEFAULT_FILL_COLOR;
		ctx.strokeStyle = DEFAULT_STROKE_COLOR;
		ctx.lineWidth = 0;
	}
	else {
		ctx = null;
	}

	function applyDrawParams(params, defualtDrawMode) {
		var result = {
			shouldFill: false,
			shouldStroke: false,
			offset: { x: global.CANVAS_WIDTH / 2, y: global.CANVAS_HEIGHT / 2 },
			zoom: params.fixed ? 1 : camera.zoom
		};

		//figure out if we should fill
		if((!params && defualtDrawMode === 'fill') ||
			(params && (params.fill || (params.color && defualtDrawMode === 'fill')))) {
			result.shouldFill = true;
			ctx.fillStyle = (params && (params.fill || params.color)) || DEFAULT_FILL_COLOR;
			ctx.lineWidth = 0;
		}
		//figure out if we should stroke
		if((!params && defualtDrawMode === 'stroke') ||
			(params && (params.stroke || (params.color && defualtDrawMode === 'stroke')))) {
			result.shouldStroke = true;
			ctx.strokeStyle = (params && (params.stroke || params.color)) || DEFAULT_STROKE_COLOR;
			ctx.lineWidth = result.zoom * (params && (params.thickness || params.thickness === 0) ? params.thickness : 1);
		}

		//return the results
		return result;
	}

	return {
		rect: function(x, y, width, height, params) {
			if(global.RENDER) {
				//(Rect) or (Rect, params)
				if(arguments.length < 3) {
					params = y; height = x.height; width = x.width; y = x.top; x = x.left;
				}
				var result = applyDrawParams(params, 'fill');
				if(result.shouldFill) {
					ctx.fillRect(result.zoom * x + result.offset.x, result.zoom * y + result.offset.y,
						result.zoom * width, result.zoom * height);
				}
				if(result.shouldStroke) {
					ctx.strokeRect(result.zoom * x + result.offset.x, result.zoom * y + result.offset.y,
						result.zoom * width, result.zoom * height);
				}
			}
		},
		circle: function(x, y, r, params) {
			if(global.RENDER) {
				var result = applyDrawParams(params, 'fill');
				ctx.beginPath();
				ctx.arc(result.zoom * x + result.offset.x, result.zoom * y + result.offset.y, result.zoom * r, 0, 2 * Math.PI);
				if(result.shouldFill) {
					ctx.fill();
				}
				if(result.shouldStroke) {
					ctx.stroke();
				}
			}
		},
		line: function(x1, y1, x2, y2, params) {
			if(global.RENDER) {
				//(Vector, Vector) or (Vector, Vector, params)
				if(arguments.length < 4) {
					params = x2; y2 = y1.y; x2 = y1.x; y1 = x1.y; x1 = x1.x;
				}
				var result = applyDrawParams(params, 'stroke');
				if(result.shouldStroke) {
					ctx.beginPath();
					ctx.moveTo(result.zoom * x1 + result.offset.x, result.zoom * y1 + result.offset.y);
					ctx.lineTo(result.zoom * x2 + result.offset.x, result.zoom * y2 + result.offset.y);
					ctx.stroke();
				}
			}
		},
		poly: function(points, params) {
			if(global.RENDER) {
				var result = applyDrawParams(params, 'stroke');
				ctx.beginPath();
				ctx.moveTo(result.zoom * points[0].x + result.offset.x, result.zoom * points[0].y + result.offset.y);
				for(var i = 1; i < points.length; i++) {
					ctx.lineTo(result.zoom * points[i].x + result.offset.x, result.zoom * points[i].y + result.offset.y);
				}
				if(!params || params.close !== false) {
					ctx.closePath();
				}
				if(result.shouldFill) {
					ctx.fill();
				}
				if(result.shouldStroke) {
					ctx.stroke();
				}
			}
		}
	};
});