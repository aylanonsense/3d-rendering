define([
	'display/draw',
	'math/projectVector',
	'geom/Vector3',
	'geom/Poly'
], function(
	draw,
	projectVector,
	Vector3,
	Poly
) {
	function Heightfield(params) {
		var r, c, i;
		var cols = params.cols || params.matrix.length;
		var rows = params.rows || params.matrix[0].length;
		var tileWidth = params.tileWidth;
		var tileLength = params.tileLength;

		this.pos = params.pos;

		//create vertices
		this.vertexMatrix = [];
		for(c = 0; c < cols; c++) {
			this.vertexMatrix[c] = [];
			for(r = 0; r < rows; r++) {
				if(params.matrix) {
					if(params.matrix[c] && params.matrix[c][r]) {
						this.vertexMatrix[c][r] = new Vector3(c * tileWidth, params.matrix[c][r], r * tileLength);
					}
					else {
						this.vertexMatrix[c][r] = null;
					}
				}
				else {
					this.vertexMatrix[c][r] = new Vector3(c * tileWidth, params.height, r * tileLength);
				}
			}
		}
		this.polyMatrix = [];
		for(c = 0; c < cols; c++) {
			this.polyMatrix[c] = [];
			for(r = 0; r < rows; r++) {
				this.polyMatrix[c][r] = [];
				if(this.vertexMatrix[c][r]) {
					if((c + r) % 2 === 0) {
						if(this.vertexMatrix[c + 1] && this.vertexMatrix[c + 1][r] && this.vertexMatrix[c][r + 1]) {
							this.polyMatrix[c][r].push(new Poly(this.vertexMatrix[c][r],
								this.vertexMatrix[c + 1][r], this.vertexMatrix[c][r + 1]));
						}
						if(this.vertexMatrix[c - 1] && this.vertexMatrix[c - 1][r] && this.vertexMatrix[c][r + 1]) {
							this.polyMatrix[c][r].push(new Poly(this.vertexMatrix[c][r],
								this.vertexMatrix[c][r + 1], this.vertexMatrix[c - 1][r]));
						}
					}
					else {
						if(this.vertexMatrix[c + 1] && this.vertexMatrix[c + 1][r + 1] && this.vertexMatrix[c][r + 1]) {
							this.polyMatrix[c][r].push(new Poly(this.vertexMatrix[c][r],
								this.vertexMatrix[c + 1][r + 1], this.vertexMatrix[c][r + 1]));
						}
						if(this.vertexMatrix[c - 1] && this.vertexMatrix[c - 1][r + 1] && this.vertexMatrix[c][r + 1]) {
							this.polyMatrix[c][r].push(new Poly(this.vertexMatrix[c][r],
								this.vertexMatrix[c][r + 1], this.vertexMatrix[c - 1][r + 1]));
						}
					}
				}
			}
		}
		//calculate light
		var lightDir = params.lightDir.clone().normalize();
		for(c = 0; c < cols; c++) {
			for(r = 0; r < rows; r++) {
				for(i = 0; i < this.polyMatrix[c][r].length; i++) {
					var amtSame = this.polyMatrix[c][r][i].normal.dot(lightDir);
					var lightness = Math.min(Math.max(1, Math.floor(10 * amtSame)), 9);
					this.polyMatrix[c][r][i].color = "#" + (lightness - 1) + (lightness - 1) + lightness;
				}
			}
		}
	}
	Heightfield.prototype.render = function() {
		for(var c = 0; c < this.polyMatrix.length; c++) {
			for(var r = 0; r < this.polyMatrix[c].length; r++) {
				for(var i = 0; i < this.polyMatrix[c][r].length; i++) {
					this.polyMatrix[c][r][i].render();
				}
			}
		}
	};
	return Heightfield;
});