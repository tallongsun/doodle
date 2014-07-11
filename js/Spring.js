//Spring Class
//弹簧
var spring = function() {
  this.x = 0;
  this.y = 0;

  this.width = 26;
  this.height = 30;

  //Sprite clipping
  this.cx = 0;
  this.cy = 0;//大图片中不同状态的弹簧所处位置
  this.cwidth = 45;
  this.cheight = 53;

  this.state = 0;

  //根据弹簧当前状态将弹簧画到画布中，位置有x,y决定，大小由width,height决定
  this.draw = function() {
    try {
      if (this.state === 0) this.cy = 445;
      else if (this.state == 1) this.cy = 501;

      ctx.drawImage(image, this.cx, this.cy, this.cwidth, this.cheight, this.x, this.y, this.width, this.height);
    } catch (e) {}
  };
};