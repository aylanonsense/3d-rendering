define([
	'display/draw',
	'math/projectVector',
	'math/Vector3'
], function(
	draw,
	projectVector,
	Vector3
) {
	function Heightfield(params) {
		var cols = params.cols;
		var rows = params.rows;
		var tileWidth = params.tileWidth;
		var tileLength = params.tileLength;

		this.pos = params.pos;

		//create vertices
		this.vertexMatrix = [];
		for(var c = 0; c < cols; c++) {
			this.vertexMatrix[c] = [];
			for(var r = 0; r < rows; r++) {
				this.vertexMatrix[c][r] = new Vector3(c * tileWidth, params.height, r * tileLength);
			}
		}
	}
	Heightfield.prototype.render = function() {
		//calculate projections
		var c, r, projections = [];
		for(c = 0; c < this.vertexMatrix.length; c++) {
			projections[c] = [];
			for(r = 0; r < this.vertexMatrix.length; r++) {
				var v = this.vertexMatrix[c][r];
				projections[c][r] = projectVector(v.x + this.pos.x, v.y + this.pos.y, v.z + this.pos.z);
			}
		}
		//draw dots
		for(c = 0; c < projections.length; c++) {
			for(r = 0; r < projections.length; r++) {
				draw.circle(projections[c][r].x, projections[c][r].y, 1, { fill: '#fff' });
				//draw lines
				if(projections[c + 1] && projections[c + 1][r]) {
					draw.line(projections[c][r].x, projections[c][r].y,
						projections[c + 1][r].x, projections[c + 1][r].y,
						{ stroke: '#fff', thickness: 1});
				}
				if(projections[c][r + 1]) {
					draw.line(projections[c][r].x, projections[c][r].y,
						projections[c][r + 1].x, projections[c][r + 1].y,
						{ stroke: '#fff', thickness: 1});
				}
				if((c + r) % 2 === 0) {
					if(projections[c + 1] && projections[c + 1][r + 1]) {
						draw.line(projections[c][r].x, projections[c][r].y,
							projections[c + 1][r + 1].x, projections[c + 1][r + 1].y,
							{ stroke: '#fff', thickness: 1});
					}
					if(projections[c - 1] && projections[c - 1][r + 1]) {
						draw.line(projections[c][r].x, projections[c][r].y,
							projections[c - 1][r + 1].x, projections[c - 1][r + 1].y,
							{ stroke: '#fff', thickness: 1});
					}
				}
			}
		}
	};
	return Heightfield;
});