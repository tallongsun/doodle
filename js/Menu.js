function playerJump() {
  player.y += player.vy;//角色垂直方向位置改变
  player.vy += gravity;//角色垂直方向速度改变

  //角色向下移动时，如果角色碰到Play按钮，则进行跳跃
  if (player.vy > 0 && 
    (player.x + 15 < 260) && 
    (player.x + player.width - 15 > 155) && 
    (player.y + player.height > 475) && 
    (player.y + player.height < 500))
    player.jump();

  //向上垂直速度>7 && <15像素/帧时，角色有一个蜷腿表现
  if (dir == "left") {
    player.dir = "left";
    if (player.vy < -7 && player.vy > -15) player.dir = "left_land";
  } else if (dir == "right") {
    player.dir = "right";
    if (player.vy < -7 && player.vy > -15) player.dir = "right_land";
  }

  //Adding keyboard controls
  document.onkeydown = function(e) {
    var key = e.keyCode;

    if (key == 37) {
      dir = "left";
      player.isMovingLeft = true;//按下左键向左移动中
    } else if (key == 39) {
      dir = "right";
      player.isMovingRight = true;//按下右键向右移动中
    }
  
    if(key == 32) {
      if(firstRun === true) {
        init();//第一次游戏进行初始化
        firstRun = false;
      }
      else 
        reset();//否则重置
    }
  };

  document.onkeyup = function(e) {
    var key = e.keyCode;

    if (key == 37) {
      dir = "left";
      player.isMovingLeft = false;//抬起左键取消向左移动
    } else if (key == 39) {
      dir = "right";
      player.isMovingRight = false;//抬起右键取消向右移动
    }
  };

  //Accelerations produces when the user hold the keys
  if (player.isMovingLeft === true) {
	//角色水平位置改变，如果角色向左移动中，速度每帧增加0.15像素
    player.x += player.vx;
    player.vx -= 0.15;
  } else {
	//角色水平位置改变，如果角色取消向右移动，速度每帧减少0.1像素，直到没有速度
    player.x += player.vx;
    if (player.vx < 0) player.vx += 0.1;
  }

  if (player.isMovingRight === true) {
    player.x += player.vx;
    player.vx += 0.15;
  } else {
    player.x += player.vx;
    if (player.vx > 0) player.vx -= 0.1;
  }

  //Jump the player when it hits the base
  //如果角色碰到基线，则进行跳跃
  if ((player.y + player.height) > base.y && base.y < height) player.jump();

  //Make the player move through walls
  //如果角色水平位置离开画布，则出现在画布另外一边
  if (player.x > width) player.x = 0 - player.width;
  else if (player.x < 0 - player.width) player.x = width;

  player.draw();
}