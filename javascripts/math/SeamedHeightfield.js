define([
	'display/draw',
	'math/projectVector',
	'math/Vector3',
	'math/Poly'
], function(
	draw,
	projectVector,
	Vector3,
	Poly
) {
	function SeamedHeightfield(params) {
		var r, c, i, v;
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
						if(typeof params.matrix[c][r] === 'object') {
							v = new Vector3(c * tileWidth, params.matrix[c][r].default, r * tileLength);
							this.vertexMatrix[c][r] = {
								upperRight: v,
								upperLeft: v,
								lowerLeft: v,
								lowerRight: v
							};
							var keys = [ 'upperRight', 'upperLeft', 'lowerLeft', 'lowerRight' ];
							for(i = 0; i < keys.length; i++) {
								var k = keys[i];
								if(typeof params.matrix[c][r][k] === 'number') {
									this.vertexMatrix[c][r][k] = new Vector3(c * tileWidth, params.matrix[c][r][k], r * tileLength);
								}
							}
						}
						else {
							v = new Vector3(c * tileWidth, params.matrix[c][r], r * tileLength);
							this.vertexMatrix[c][r] = {
								upperRight: v,
								upperLeft: v,
								lowerLeft: v,
								lowerRight: v
							};
						}
					}
					else {
						this.vertexMatrix[c][r] = null;
					}
				}
				else {
					v = new Vector3(c * tileWidth, params.height, r * tileLength);
					this.vertexMatrix[c][r] = {
						upperRight: v,
						upperLeft: v,
						lowerLeft: v,
						lowerRight: v
					};
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
							this.polyMatrix[c][r].push(new Poly(
								this.vertexMatrix[c][r].lowerRight,
								this.vertexMatrix[c + 1][r].lowerLeft,
								this.vertexMatrix[c][r + 1].upperRight));
						}
						if(this.vertexMatrix[c - 1] && this.vertexMatrix[c - 1][r] && this.vertexMatrix[c][r + 1]) {
							this.polyMatrix[c][r].push(new Poly(
								this.vertexMatrix[c][r].lowerLeft,
								this.vertexMatrix[c][r + 1].upperLeft,
								this.vertexMatrix[c - 1][r].lowerRight));
						}
					}
					else {
						if(this.vertexMatrix[c + 1] && this.vertexMatrix[c + 1][r + 1] && this.vertexMatrix[c][r + 1]) {
							this.polyMatrix[c][r].push(new Poly(
								this.vertexMatrix[c][r].lowerRight,
								this.vertexMatrix[c + 1][r + 1].upperLeft,
								this.vertexMatrix[c][r + 1].upperRight));
						}
						if(this.vertexMatrix[c - 1] && this.vertexMatrix[c - 1][r + 1] && this.vertexMatrix[c][r + 1]) {
							this.polyMatrix[c][r].push(new Poly(
								this.vertexMatrix[c][r].lowerLeft,
								this.vertexMatrix[c][r + 1].upperLeft,
								this.vertexMatrix[c - 1][r + 1].upperRight));
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
	SeamedHeightfield.prototype.render = function() {
		for(var c = 0; c < this.polyMatrix.length; c++) {
			for(var r = 0; r < this.polyMatrix[c].length; r++) {
				for(var i = 0; i < this.polyMatrix[c][r].length; i++) {
					this.polyMatrix[c][r][i].render();
				}
			}
		}
	};
	return SeamedHeightfield;
});