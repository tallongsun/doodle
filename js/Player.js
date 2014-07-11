//Player object
//角色
var Player = function() {
  this.vy = 11;
  this.vx = 0;

  this.isMovingLeft = false;
  this.isMovingRight = false;
  this.isDead = false;

  //Sprite clipping
  this.cx = 0;
  this.cy = 0;//大图片中不同朝向的角色所处位置
  this.cwidth = 110;
  this.cheight = 80;

  this.dir = "left";

  this.width = 55;
  this.height = 40;
  this.x = width / 2 - this.width / 2;
  this.y = height;

  //Function to draw it
  //根据角色当前朝向将角色画到画布中，位置有x,y决定，大小由width,height决定
  this.draw = function() {
    try {
      if (this.dir == "right") this.cy = 121;
      else if (this.dir == "left") this.cy = 201;
      else if (this.dir == "right_land") this.cy = 289;
      else if (this.dir == "left_land") this.cy = 371;

      ctx.drawImage(image, this.cx, this.cy, this.cwidth, this.cheight, this.x, this.y, this.width, this.height);
    } catch (e) {}
  };

  //小跳垂直方向速度，每帧向上8像素
  this.jump = function() {
    this.vy = -8;
  };

  //大跳垂直方向速度，每帧向上16像素
  this.jumpHigh = function() {
    this.vy = -16;
  };

};