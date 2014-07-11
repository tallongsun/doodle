//Platform class
//跳板
function Platform() {
	
  this.width = 70;
  this.height = 17;
  this.x = Math.random() * (width - this.width);//水平位置随机
  this.y = position;//垂直位置55.2像素一个

  position += (height / platformCount);

  this.flag = 0;//跳板破碎状态，默认未破碎
  this.state = 0;//跳板消失状态，默认未消失

  //Sprite clipping
  this.cx = 0;
  this.cy = 0;//大图片中不同类型的跳板所处位置
  this.cwidth = 105;
  this.cheight = 31;

  //Function to draw it
  //根据跳板类型和状态将跳板画到画布中，位置有x,y决定，大小由width,height决定
  this.draw = function() {
    try {

      if (this.type == 1) this.cy = 0;//普通跳板，绿色
      else if (this.type == 2) this.cy = 61;//移动跳板，蓝色
      else if (this.type == 3 && this.flag === 0) this.cy = 31;//易碎跳板，红色
      else if (this.type == 3 && this.flag == 1) this.cy = 1000;//易碎跳板，破碎状态，消失
      else if (this.type == 4 && this.state === 0) this.cy = 90;//消失跳板，白色
      else if (this.type == 4 && this.state == 1) this.cy = 1000;//消失跳板，消失状态，消失

      ctx.drawImage(image, this.cx, this.cy, this.cwidth, this.cheight, this.x, this.y, this.width, this.height);
    } catch (e) {}
  };

  //Platform types
  //1: Normal
  //2: Moving
  //3: Breakable (Go through)
  //4: Vanishable 
  //Setting the probability of which type of platforms should be shown at what score
  if (score >= 5000) this.types = [2, 3, 3, 3, 4, 4, 4, 4];
  else if (score >= 2000 && score < 5000) this.types = [2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4];
  else if (score >= 1000 && score < 2000) this.types = [2, 2, 2, 3, 3, 3, 3, 3];
  else if (score >= 500 && score < 1000) this.types = [1, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3];
  else if (score >= 100 && score < 500) this.types = [1, 1, 1, 1, 2, 2];
  else this.types = [1,2,3,4];

  //从当前分数分组中随机一个类型
  this.type = this.types[Math.floor(Math.random() * this.types.length)];

  //We can't have two consecutive breakable platforms otherwise it will be impossible to reach another platform sometimes!
  if (this.type == 3 && broken < 1) {
    broken++;
  } else if (this.type == 3 && broken >= 1) {
    this.type = 1;
    broken = 0;
  }

  this.moved = 0;
  this.vx = 1;//水平速度1像素/帧
}

//Broken platform object
//破碎的跳板，最多只能有1个易碎跳板，因此最多也只会画一个
var Platform_broken_substitute = function() {
  this.height = 30;
  this.width = 70;

  this.x = 0;
  this.y = 0;

  //Sprite clipping
  this.cx = 0;
  this.cy = 554;
  this.cwidth = 105;//大图片中破碎的跳板所处位置
  this.cheight = 60;

  this.appearance = false;

  //如果需要，将破碎的跳板画到画布中，位置有x,y决定，大小由width,height决定
  this.draw = function() {
    try {
      if (this.appearance === true) ctx.drawImage(image, this.cx, this.cy, this.cwidth, this.cheight, this.x, this.y, this.width, this.height);
      else return;
    } catch (e) {}
  };
};