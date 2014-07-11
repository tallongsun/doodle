function init() {
  //Variables for the game
  var dir = "left",
    jumpCount = 0;//貌似不需要
  
  firstRun = false;

  //Function for clearing canvas in each consecutive frame

  function paintCanvas() {
    ctx.clearRect(0, 0, width, height);
  }

  //Player related calculations and functions
  //角色逻辑计算和渲染
  function playerCalc() {
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
        if(firstRun === true)
          init();
        else 
          reset();
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

    // Speed limits!
    // 水平速度不可以超过8像素/帧
    if(player.vx > 8)
      player.vx = 8;
    else if(player.vx < -8)
      player.vx = -8;

    //console.log(player.vx);
    
    //Jump the player when it hits the base
    //如果角色碰到基线，则进行跳跃
    if ((player.y + player.height) > base.y && base.y < height) player.jump();

    //Gameover if it hits the bottom 
    //如果基线已经离开画布的时候，角色离开画布，则判断角色死亡
    if (base.y > height && (player.y + player.height) > height && player.isDead != "lol") player.isDead = true;

    //Make the player move through walls
    //如果角色水平位置离开画布，则出现在画布另外一边
    if (player.x > width) player.x = 0 - player.width;
    else if (player.x < 0 - player.width) player.x = width;

    //Movement of player affected by gravity
    if (player.y >= (height / 2) - (player.height / 2)) {
      //角色未到画布一半高度
      player.y += player.vy;//角色垂直方向位置改变
      player.vy += gravity;//角色垂直方向速度改变
    }
    //When the player reaches half height, move the platforms to create the illusion of scrolling and recreate the platforms that are out of viewport...
    else {
      //角色升到画布一半高度
      platforms.forEach(function(p, i) {
    	//所有的跳板向下移动
        if (player.vy < 0) {
          p.y -= player.vy;
        }
        //离开画布的跳板需要在顶部重新创建
        if (p.y > height) {
          platforms[i] = new Platform();
          platforms[i].y = p.y - height;
        }

      });

      //基线离开画布消失
      base.y -= player.vy;
      //角色不能再向上移动了，向下速度一直增加
      player.vy += gravity;

      if (player.vy >= 0) {
    	//如果角色向下移动了
        player.y += player.vy;//角色垂直方向位置改变
        player.vy += gravity;//角色垂直方向速度改变
      }

      //积分+1
      score++;
    }

    //Make the player jump when it collides with platforms
    //检查角色跟跳板弹簧的碰撞
    collides();

    if (player.isDead === true) gameOver();
    
    player.draw();
  }

  //Spring algorithms
  //弹簧逻辑计算和渲染
  function springCalc() {
    var s = Spring;
    var p = platforms[0];

    if (p.type == 1 || p.type == 2) {//对于普通跳板和移动跳板
      //弹簧位于最上面的跳板的中央
      s.x = p.x + p.width / 2 - s.width / 2;
      s.y = p.y - p.height - 10;

      //弹簧将要离开画布时，恢复收缩状态
      if (s.y > height / 1.1) s.state = 0;

      s.draw();
    } else {//对于易碎跳板和消失跳板
      //不需要弹簧
      s.x = 0 - s.width;
      s.y = 0 - s.height;
    }
  }

  //Platform's horizontal movement (and falling) algo
  //跳板逻辑计算和渲染
  function platformCalc() {
    var subs = platform_broken_substitute;

    platforms.forEach(function(p, i) {
      if (p.type == 2) {//移动跳板在水平方向来回移动
        if (p.x < 0 || p.x + p.width > width) p.vx *= -1;

        p.x += p.vx;
      }

      if (p.flag == 1 && subs.appearance === false && jumpCount === 0) {
        subs.x = p.x;
        subs.y = p.y;
        subs.appearance = true;

        jumpCount++;
      }

      p.draw();
    });

    //如果产生破碎跳板，破碎跳板向下移动直到移出画布
    if (subs.appearance === true) {
      subs.draw();
      subs.y += 8;
    }

    if (subs.y > height) subs.appearance = false;
  }

  function collides() {
    //Platforms
    platforms.forEach(function(p, i) {
      //角色向下，跳板未消失状态，角色在跳板上，则表示角色碰撞到该跳板
      if (player.vy > 0 && p.state === 0 && (player.x + 15 < p.x + p.width) && (player.x + player.width - 15 > p.x) && (player.y + player.height > p.y) && (player.y + player.height < p.y + p.height)) {

        if (p.type == 3 && p.flag === 0) {//1.接触易碎跳板
          //易碎跳板变为破碎状态
          p.flag = 1;
          jumpCount = 0;
          return;
        } else if (p.type == 4 && p.state === 0) {//2.接触消失跳板
          //角色小跳，消失跳板变为消失状态
          player.jump();
          p.state = 1;
        } else if (p.flag == 1) {
          return;	
        } else {//3.接触普通跳板，移动跳板
          //角色小跳
          player.jump();
        }
      }
    });

    //Springs
    var s = Spring;
    //角色向下，弹簧收缩状态，角色在弹簧上，则表示角色碰撞到弹簧
    if (player.vy > 0 && (s.state === 0) && (player.x + 15 < s.x + s.width) && (player.x + player.width - 15 > s.x) && (player.y + player.height > s.y) && (player.y + player.height < s.y + s.height)) {
      s.state = 1;//弹簧变为展开状态
      player.jumpHigh();//角色大跳
    }

  }

  function updateScore() {
    var scoreText = document.getElementById("score");
    scoreText.innerHTML = score;
  }

  function gameOver() {
	//保证所有实体离开画布，跳板，弹簧，角色等  
	  
    platforms.forEach(function(p, i) {
      //所有跳板不断向上离开画布
      p.y -= 12;
    });

    if(player.y > height/2 && flag === 0) {
      //角色向画布中间移动
      player.y -= 8;
      player.vy = 0;
    } 
    else if(player.y < height / 2) flag = 1;//角色向上超过画布中间点后，不再向上移动
    else if(player.y + player.height > height) {
      //角色	向下移动离开画布后
      //显示GameOver菜单
      showGoMenu();
      //隐藏计分
      hideScore();
      //真死了
      player.isDead = "lol";

      var tweet = document.getElementById("tweetBtn");
      tweet.href='http://twitter.com/share?url=http://is.gd/PnFFzu&text=I just scored ' +score+ ' points in the HTML5 Doodle Jump game!&count=horiztonal&via=cssdeck&related=solitarydesigns';
    
      var facebook = document.getElementById("fbBtn");
      facebook.href='http://facebook.com/sharer.php?s=100&p[url]=http://cssdeck.com/labs/html5-doodle-jump/8&p[title]=I just scored ' +score+ ' points in the HTML5 Doodle Jump game!&p[summary]=Can you beat me in this awesome recreation of Doodle Jump created in HTML5?';

    }
  }

  //Function to update everything

  function update() {
	//画布清空
    paintCanvas();
    
    platformCalc();
    springCalc();
    playerCalc();

    base.draw();

    //更新计分
    updateScore();
  }

  //停止菜单主循环
  menuLoop = function(){return;};
  animloop = function() {
	//每秒60帧
    update();
    requestAnimFrame(animloop);
  };

  //游戏主循环
  animloop();
  //隐藏菜单，显示计分
  hideMenu();
  showScore();
}


function reset() {
	  //隐藏GameOver菜单，显示计分，重置各变量
	  hideGoMenu();
	  showScore();
	  player.isDead = false;
	  
	  flag = 0;
	  position = 0;
	  score = 0;

	  base = new Base();
	  player = new Player();
	  Spring = new spring();
	  platform_broken_substitute = new Platform_broken_substitute();

	  platforms = [];
	  for (var i = 0; i < platformCount; i++) {
	    platforms.push(new Platform());
	  }
}