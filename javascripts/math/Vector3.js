define(function() {
	function Vector3(x, y, z) {
		this.x = x || 0;
		this.y = y || 0;
		this.z = z || 0;
	}
	Vector3.prototype.clone = function() {
		return new Vector3(this.x, this.y, this.z);
	};
	Vector3.prototype.set = function(x, y, z) {
		if(arguments.length === 1) { z = x.z; y = x.y; x = x.x; }
		this.x = x;
		this.y = y;
		this.z = z;
		return this;
	};
	Vector3.prototype.add = function(x, y, z) {
		if(arguments.length === 1) { z = x.z; y = x.y; x = x.x; }
		this.x += x;
		this.y += y;
		this.z += z;
		return this;
	};
	Vector3.prototype.addMult = function(x, y, z, mult) {
		if(arguments.length === 2) { mult = y; z = x.z; y = x.y; x = x.x; }
		this.x += x * mult;
		this.y += y * mult;
		this.z += z * mult;
		return this;
	};
	Vector3.prototype.subtract = function(x, y, z) {
		if(arguments.length === 1) { z = x.z; y = x.y; x = x.x; }
		this.x -= x;
		this.y -= y;
		this.z -= z;
		return this;
	};
	Vector3.prototype.multiply = function(x, y, z) {
		if(arguments.length === 1) { z = x; y = x; }
		this.x *= x;
		this.y *= y;
		this.z *= z;
		return this;
	};
	// TODO Vector3.prototype.rotate
	// TODO Vector3.prototype.unrotate
	Vector3.prototype.divide = function(x, y, z) {
		if(arguments.length === 1) { z = x; y = x; }
		this.x /= x;
		this.y /= y;
		this.z /= z;
		return this;
	};
	Vector3.prototype.zero = function() {
		this.x = 0;
		this.y = 0;
		this.z = 0;
		return this;
	};
	Vector3.prototype.isZero = function() {
		return this.x === 0 && this.y === 0 && this.z === 0;
	};
	Vector3.prototype.squareLength = function() {
		return this.x * this.x + this.y * this.y + this.z * this.z;
	};
	Vector3.prototype.length = function() {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
	};
	Vector3.prototype.setLength = function(newLen) {
		//TODO does this actually work?
		var len = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
		if(len === 0) {
			this.x = 0;
			this.y = 0;
			this.z = 0;
		}
		else {
			this.x *= newLen / len;
			this.y *= newLen / len;
			this.z *= newLen / len;
		}
		return this;
	};
	Vector3.prototype.normalize = function() {
		//TODO does this actually work?
		var len = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
		if(len === 0) {
			this.x = 0;
			this.y = 0;
			this.z = 0;
		}
		else {
			this.x /= len;
			this.y /= len;
			this.z /= len;
		}
		return this;
	};
	Vector3.prototype.createVectorTo = function(x, y, z) {
		if(arguments.length === 1) { z = x.z; y = x.y; x = x.x; }
		return new Vector3(x - this.x, y - this.y, z - this.z);
	};
	Vector3.prototype.average = function(x, y, z) {
		if(arguments.length === 1) { z = x.z; y = x.y; x = x.x; }
		this.x = (this.x + x) / 2;
		this.y = (this.y + y) / 2;
		this.z = (this.z + z) / 2;
		return this;
	};
	Vector3.prototype.cross = function(x, y, z) {
		if(arguments.length === 1) { z = x.z; y = x.y; x = x.x; }
		var crossX = this.y * z - this.z * y;
		var crossY = this.z * x - this.x * z;
		var crossZ = this.x * y - this.y * x;
		this.x = crossX;
		this.y = crossY;
		this.z = crossZ;
		return this;
	};
	Vector3.prototype.dot = function(x, y, z) {
		if(arguments.length === 1) { z = x.z; y = x.y; x = x.x; }
		return this.x * x + this.y * y + this.z * z;
	};
	Vector3.prototype.proj = function(x, y, z) {
		if(arguments.length === 1) { z = x.z; y = x.y; x = x.x; }
		var dotProd = this.x * x + this.y * y + this.z * z;
		var squareLen = x * x + y * y + z * z;
		this.x = x * dotProd / squareLen;
		this.y = y * dotProd / squareLen;
		this.z = z * dotProd / squareLen;
		return this;
	};
	Vector3.prototype.angle = function() {
		return Math.atan2(this.y, this.x);
	};
	Vector3.prototype.distance = function(x, y, z) {
		if(arguments.length === 1) { z = x.z; y = x.y; x = x.x; }
		var dx = this.x - x;
		var dy = this.y - y;
		var dz = this.z - z;
		return Math.sqrt(dx * dx + dy * dy + dz * dz);
	};
	Vector3.prototype.squareDistance = function(x, y, z) {
		if(arguments.length === 1) { z = x.z; y = x.y; x = x.x; }
		var dx = this.x - x;
		var dy = this.y - y;
		var dz = this.z - z;
		return dx * dx + dy * dy + dz * dz;
	};
	Vector3.prototype.equals = function(x, y, z) {
		if(arguments.length === 1) { z = x.z; y = x.y; x = x.x; }
		return this.x === x && this.y === y && this.z === z;
	};
	Vector3.prototype.isZero = function() {
		return this.x === 0 && this.y === 0 && this.z === 0;
	};
	Vector3.prototype.toString = function() {
		//for readability we reduce really small numbers to 0
		return 'x:' + (-0.0000000001 < this.x && this.x < 0.0000000001 ? 0 : Math.floor(100 * this.x) / 100) +
			', y:' + (-0.0000000001 < this.y && this.y < 0.0000000001 ? 0 : Math.floor(100 * this.y) / 100) +
			', z:' + (-0.0000000001 < this.z && this.z < 0.0000000001 ? 0 : Math.floor(100 * this.z) / 100);
	};
	return Vector3;
});