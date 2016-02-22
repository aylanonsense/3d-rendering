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
		var cols = params.cols || params.matrix.length;
		var rows = params.rows || params.matrix[0].length;
		this.tileWidth = params.tileWidth;
		this.tileLength = params.tileLength;

		//create vertices
		this.vertexMatrix = [];
		for(c = 0; c < cols; c++) {
			this.vertexMatrix[c] = [];
			for(r = 0; r < rows; r++) {
				if(params.matrix) {
					if(params.matrix[c] && (params.matrix[c][r] || params.matrix[c][r] === 0)) {
						if(typeof params.matrix[c][r] === 'object') {
							v = new Vector3(c * this.tileWidth, params.matrix[c][r].default, r * this.tileLength);
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
									this.vertexMatrix[c][r][k] = new Vector3(c * this.tileWidth, params.matrix[c][r][k], r * this.tileLength);
								}
							}
						}
						else {
							v = new Vector3(c * this.tileWidth, params.matrix[c][r], r * this.tileLength);
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
					v = new Vector3(c * this.tileWidth, params.height, r * this.tileLength);
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
								this.vertexMatrix[c][r + 1].upperRight, { color: '#f00' }));
						}
						else {
							this.polyMatrix[c][r].push(null);
						}
						if(this.vertexMatrix[c + 1] && this.vertexMatrix[c][r + 1] && this.vertexMatrix[c + 1][r] && this.vertexMatrix[c + 1][r + 1]) {
							this.polyMatrix[c][r].push(new Poly(
								this.vertexMatrix[c][r + 1].upperRight,
								this.vertexMatrix[c + 1][r].lowerLeft,
								this.vertexMatrix[c + 1][r + 1].upperLeft, { color: '#ff0' }));
						}
						else {
							this.polyMatrix[c][r].push(null);
						}
					}
					else {
						if(this.vertexMatrix[c + 1] && this.vertexMatrix[c + 1][r + 1] && this.vertexMatrix[c][r + 1]) {
							this.polyMatrix[c][r].push(new Poly(
								this.vertexMatrix[c][r].lowerRight,
								this.vertexMatrix[c + 1][r + 1].upperLeft,
								this.vertexMatrix[c][r + 1].upperRight, { color: '#0f0' }));
						}
						else {
							this.polyMatrix[c][r].push(null);
						}
						if(this.vertexMatrix[c + 1] && this.vertexMatrix[c + 1][r] && this.vertexMatrix[c + 1][r + 1]) {
							this.polyMatrix[c][r].push(new Poly(
								this.vertexMatrix[c][r].lowerRight,
								this.vertexMatrix[c + 1][r].lowerLeft,
								this.vertexMatrix[c + 1][r + 1].upperLeft, { color: '#00f' }));
						}
						else {
							this.polyMatrix[c][r].push(null);
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
					if(this.polyMatrix[c][r][i]) {
						var amtSame = this.polyMatrix[c][r][i].normal.dot(lightDir);
						var lightness = Math.min(Math.max(1, Math.floor(10 * amtSame)), 9);
						this.polyMatrix[c][r][i].color = "#" + (lightness - 1) + (lightness - 1) + lightness;
					}
				}
			}
		}
	}
	SeamedHeightfield.prototype.render = function() {
		for(var c = 0; c < this.polyMatrix.length; c++) {
			for(var r = 0; r < this.polyMatrix[c].length; r++) {
				for(var i = 0; i < this.polyMatrix[c][r].length; i++) {
					if(this.polyMatrix[c][r][i]) {
						this.polyMatrix[c][r][i].render();
					}
				}
			}
		}
	};
	SeamedHeightfield.prototype.findCollisionWithEntity = function(entity) {
		var x = entity.pos.x, z = entity.pos.z;
		var c = Math.floor(x / this.tileWidth);
		var r = Math.floor(z / this.tileLength);
		//figure out which cell it's over
		if(this.polyMatrix[c] && this.polyMatrix[c][r]) {
			//now we figure out which polygon in that cell it's over
			var i;
			if((c + r) % 2 === 0) {
				i = x > z ? 0 : 1;
			}
			else {
				i = x > -z ? 0 : 1;
			}
			if(this.polyMatrix[c][r][i]) {
				var poly = this.polyMatrix[c][r][i];
				//ok we have the right polygon, is there a collision?
				var y = (poly.vectors[0].x * poly.normal.x +
					poly.vectors[0].y * poly.normal.y +
					poly.vectors[0].z * poly.normal.z -
					entity.pos.x * poly.normal.x -
					entity.pos.z * poly.normal.z) / poly.normal.y;
 
				//we don't determine if the entity has passed through this height, leaving that to the entity
				return {
					y: y,
					normal: poly.normal
				};
			}
		}
		return null;
	};
	return SeamedHeightfield;
});