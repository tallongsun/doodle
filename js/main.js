// RequestAnimFrame: a browser API for getting smooth animations
window.requestAnimFrame = (function() {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
  function(callback) {
    window.setTimeout(callback, 1000 / 60);
  };
})();

var canvas = document.getElementById('canvas'),
  ctx = canvas.getContext('2d');
var width = 422,height = 552;
canvas.width = width;
canvas.height = height;

//Variables for game
var image = document.getElementById("sprite"),//大图片
  platformCount = 10,//跳板个数
  position = 0,//跳板垂直方向位置
  gravity = 0.2,//重力加速度
  flag = 0,//GameOver时，是否在移除画布中实体，0在移除
  broken = 0,//当前易碎跳板个数
  dir,//当前选择方向 
  score = 0, //当前分数
  firstRun = true,//是否第一次游戏
  animloop,
  menuloop;

var base = new Base();//1条基线
var player = new Player();//1个角色
var platforms = [];//10个跳板
for (var i = 0; i < platformCount; i++) {
  platforms.push(new Platform());
}
var platform_broken_substitute = new Platform_broken_substitute();//1个破碎跳板
var Spring = new spring();//1个弹簧

function update() {
	//每帧重绘Menu
	ctx.clearRect(0, 0, width, height);
	playerJump();
}   

menuLoop = function() {
	//每秒60帧
	update();
	requestAnimFrame(menuLoop);
};

//菜单主循环
menuLoop();


//Hides the menu
function hideMenu() {
  var menu = document.getElementById("mainMenu");
  menu.style.zIndex = -1;
}

//Shows the game over menu
function showGoMenu() {
  var menu = document.getElementById("gameOverMenu");
  menu.style.zIndex = 1;
  menu.style.visibility = "visible";

  var scoreText = document.getElementById("go_score");
  scoreText.innerHTML = "You scored " + score + " points!";
}

//Hides the game over menu
function hideGoMenu() {
  var menu = document.getElementById("gameOverMenu");
  menu.style.zIndex = -1;
  menu.style.visibility = "hidden";
}

//Show ScoreBoard
function showScore() {
  var menu = document.getElementById("scoreBoard");
  menu.style.zIndex = 1;
}

//Hide ScoreBoard
function hideScore() {
  var menu = document.getElementById("scoreBoard");
  menu.style.zIndex = -1;
}



