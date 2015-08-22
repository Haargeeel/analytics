var Pen = function(length) {
  this.canvas = document.getElementById('canvas');
  this.ctx = canvas.getContext('2d');
  this.step = Math.ceil(canvas.width / (length - 1));
};

Pen.prototype.constructor = Pen;

var getColor = function(y1, y2) {
  // use only one color
  return '#2222dd';

  // use more colors which is kinda ugly
  //if (y1 > y2)
    //return '#22dd22';
  //else if (y1 < y2)
    //return '#dd2222';
  //else
    //return '#dddd22';
};

Pen.prototype.drawLine = function(p1, p2, which) {
  var ctx = this.ctx;
  ctx.globalAlpha = 1;
  ctx.beginPath();
  if (which === 'old')
    ctx.strokeStyle = '#888';
  if (which === 'new')
    ctx.strokeStyle = getColor(p1.y, p2.y);
  ctx.moveTo(p1.x * this.step, p1.y);
  ctx.lineTo(p2.x * this.step, p2.y);
  ctx.stroke();
  ctx.closePath();
};

Pen.prototype.drawIntegral = function(p1, p2, which) {
  var ctx = this.ctx;
  ctx.globalAlpha = 0.1;
  ctx.beginPath();
  if (which === 'old')
    ctx.fillStyle = '#888';
  if (which === 'new')
    ctx.fillStyle = getColor(p1.y, p2.y);
  ctx.moveTo(p1.x * this.step, p1.y);
  ctx.lineTo(p2.x * this.step, p2.y);
  ctx.lineTo(p2.x * this.step, this.canvas.height);
  ctx.lineTo(p1.x * this.step, this.canvas.height);
  ctx.fill();
  ctx.closePath();
};

module.exports = Pen;
