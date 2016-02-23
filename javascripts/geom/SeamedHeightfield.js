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
	var HEIGHT_ERROR = 200;

	function SeamedHeightfield(params) {
		var r, c, i, v;
		var rows = params.rows || params.matrix.length;
		var cols = params.cols || params.matrix[0].length;
		this.tileWidth = params.tileWidth;
		this.tileLength = params.tileLength;

		//create vertices
		var vertexMatrix = [];
		for(r = 0; r < rows; r++) {
			vertexMatrix[r] = [];
			for(c = 0; c < cols; c++) {
				if(params.matrix) {
					if(params.matrix[r] && (params.matrix[r][c] || params.matrix[r][c] === 0)) {
						if(typeof params.matrix[r][c] === 'object') {
							v = new Vector3(c * this.tileWidth, params.matrix[r][c].default, r * this.tileLength);
							vertexMatrix[r][c] = {
								upperRight: v,
								upperLeft: v,
								lowerLeft: v,
								lowerRight: v
							};
							var keys = [ 'upperRight', 'upperLeft', 'lowerLeft', 'lowerRight' ];
							for(i = 0; i < keys.length; i++) {
								var k = keys[i];
								if(typeof params.matrix[r][c][k] === 'number') {
									vertexMatrix[r][c][k] = new Vector3(c * this.tileWidth, params.matrix[r][c][k], r * this.tileLength);
								}
							}
						}
						else {
							v = new Vector3(c * this.tileWidth, params.matrix[r][c], r * this.tileLength);
							vertexMatrix[r][c] = {
								upperRight: v,
								upperLeft: v,
								lowerLeft: v,
								lowerRight: v
							};
						}
					}
					else {
						vertexMatrix[r][c] = null;
					}
				}
				else {
					v = new Vector3(c * this.tileWidth, params.height, r * this.tileLength);
					vertexMatrix[r][c] = {
						upperRight: v,
						upperLeft: v,
						lowerLeft: v,
						lowerRight: v
					};
				}
			}
		}
		this.polyMatrix = [];
		for(r = 0; r < rows; r++) {
			this.polyMatrix[r] = [];
			for(c = 0; c < cols; c++) {
				this.polyMatrix[r][c] = [];
				if(vertexMatrix[r][c]) {
					if((c + r) % 2 === 0) {
						if(vertexMatrix[r][c + 1] && vertexMatrix[r + 1] && vertexMatrix[r + 1][c]) {
							this.polyMatrix[r][c].push(new Poly(
								vertexMatrix[r][c].lowerRight,
								vertexMatrix[r][c + 1].lowerLeft,
								vertexMatrix[r + 1][c].upperRight, { color: '#f00' }));
						}
						else {
							this.polyMatrix[r][c].push(null);
						}
						if(vertexMatrix[r + 1] && vertexMatrix[r + 1][c] && vertexMatrix[r][c + 1] && vertexMatrix[r + 1][c + 1]) {
							this.polyMatrix[r][c].push(new Poly(
								vertexMatrix[r + 1][c].upperRight,
								vertexMatrix[r][c + 1].lowerLeft,
								vertexMatrix[r + 1][c + 1].upperLeft, { color: '#ff0' }));
						}
						else {
							this.polyMatrix[r][c].push(null);
						}
					}
					else {
						if(vertexMatrix[r + 1] && vertexMatrix[r + 1][c + 1] && vertexMatrix[r + 1][c]) {
							this.polyMatrix[r][c].push(new Poly(
								vertexMatrix[r][c].lowerRight,
								vertexMatrix[r + 1][c + 1].upperLeft,
								vertexMatrix[r + 1][c].upperRight, { color: '#0f0' }));
						}
						else {
							this.polyMatrix[r][c].push(null);
						}
						if(vertexMatrix[r][c + 1] && vertexMatrix[r + 1] && vertexMatrix[r + 1][c + 1]) {
							this.polyMatrix[r][c].push(new Poly(
								vertexMatrix[r][c].lowerRight,
								vertexMatrix[r][c + 1].lowerLeft,
								vertexMatrix[r + 1][c + 1].upperLeft, { color: '#00f' }));
						}
						else {
							this.polyMatrix[r][c].push(null);
						}
					}
				}
			}
		}
		//calculate light
		var lightDir = params.lightDir.clone().normalize();
		for(r = 0; r < rows; r++) {
			for(c = 0; c < cols; c++) {
				for(i = 0; i < this.polyMatrix[r][c].length; i++) {
					if(this.polyMatrix[r][c][i]) {
						var amtSame = this.polyMatrix[r][c][i].normal.dot(lightDir);
						var lightness = Math.min(Math.max(1, Math.floor(10 * amtSame)), 9);
						this.polyMatrix[r][c][i].color = "#" + (lightness - 1) + (lightness - 1) + lightness;
					}
				}
			}
		}
	}
	SeamedHeightfield.prototype.render = function() {
		for(var r = 0; r < this.polyMatrix.length; r++) {
			for(var c = 0; c < this.polyMatrix[r].length; c++) {
				for(var i = 0; i < this.polyMatrix[r][c].length; i++) {
					if(this.polyMatrix[r][c][i]) {
						this.polyMatrix[r][c][i].render();
					}
				}
			}
		}
	};
	SeamedHeightfield.prototype._findPolyUnder = function(x, z) {
		if(arguments.length === 1) { z = x.z; x = x.x; }
		var c = Math.floor(x / this.tileWidth);
		var r = Math.floor(z / this.tileLength);
		//figure out which cell it's over
		if(this.polyMatrix[r] && this.polyMatrix[r][c]) {
			//now we figure out which polygon in that cell it's over
			var i;
			if((c + r) % 2 === 0) {
				i = x > z ? 0 : 1;
			}
			else {
				i = x > -z ? 0 : 1;
			}
			if(this.polyMatrix[r][c][i]) {
				return this.polyMatrix[r][c][i];
			}
		}
		return null;
	};
	SeamedHeightfield.prototype.findCollisionWithEntity = function(entity) {
		var poly = this._findPolyUnder(entity.pos.x, entity.pos.z);
		if(poly) {
			//we don't determine if the entity has passed through this height, leaving that to the entity
			return {
				y: poly.findHeightAt(entity.pos.x, entity.pos.z),
				poly: poly,
				normal: poly.normal
			};
		}
		return null;
	};
	return SeamedHeightfield;
});