var Point = function(x, y) {
  this.canvas = document.getElementById('canvas');
  this.x = x;
  this.y = Math.abs(this.canvas.height - y);
};

Point.prototype.constructor = Point;

module.exports = Point;
