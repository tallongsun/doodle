//Base object
//基线
var Base = function() {
  this.height = 5;
  this.width = width;

  //Sprite clipping
  this.cx = 0;
  this.cy = 614;
  this.cwidth = 100;
  this.cheight = 5;

  this.moved = 0;

  this.x = 0;
  this.y = height - this.height;

  //将基线画到画布中，位置有x,y决定，大小由width,height决定
  this.draw = function() {
    try {
      ctx.drawImage(image, this.cx, this.cy, this.cwidth, this.cheight, this.x, this.y, this.width, this.height);
    } catch (e) {}
  };
};