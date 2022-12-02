window.onload = init;
var backgroundCanvas = document.getElementById('background'),
	gameCanvas = document.getElementById('game'),
	columnTopCanvas = document.getElementById('columnTop'),
	columnBottomCanvas = document.getElementById('columnBottom'),
	titleCanvas = document.getElementById('title'),
	infoCanvas = document.getElementById('info'),
	startScreenCanvas = document.getElementById('startScreen');


var ctxBackground = backgroundCanvas.getContext('2d'),
	ctxGame = gameCanvas.getContext('2d'),
	ctxColumnTop = columnTopCanvas.getContext('2d'),
	ctxColumnBottom = columnBottomCanvas.getContext('2d'),
	ctxTitle = titleCanvas.getContext('2d'),
	ctxInfo = infoCanvas.getContext('2d'),
	ctxstartScreen = startScreenCanvas.getContext('2d');

var gameWidth = 1100,
	gameHeight = 650;

// переменные для картинок
var imgBackground = new Image();
imgBackground.src = 'img/fon.jpg';

var imgHero = new Image();
imgHero.src = 'img/Flappy_Bird.png';
var imgHeroUP = new Image();
imgHeroUP.src = 'img/Flappy_Bird_Up.png';

function kirHero() {
	imgHero.src = 'img/kir_base.png';
	imgHeroUP.src = 'img/kir_jump.png';
	playerObject.height = 81;
	playerObject.width = 56;
	drawHero();
}

function birdHero() {
	imgHero.src = 'img/Flappy_Bird.png';
	imgHeroUP.src = 'img/Flappy_Bird_Up.png';
	playerObject.height = 50;
	playerObject.width = 75;
	drawHero();
}

// рисуем фон
function drawBackground() {
	ctxBackground.drawImage(imgBackground, 0, 0, gameWidth, gameHeight);
	// делаю паттерн из фоновой картинки

	// TODO доработать с повтором картинки
	// ctxBackground.fillStyle = ctxBackground.createPattern(imgBackground, 'repeat-x');
	// ctxBackground.fillRect(0, 0, gameWidth, gameHeight);
}

function init() {
	backgroundCanvas.width = gameWidth;
	backgroundCanvas.height = gameHeight;
	gameCanvas.width = gameWidth;
	gameCanvas.height = gameHeight;
	columnTopCanvas.width = gameWidth;
	columnTopCanvas.height = gameHeight;
	columnBottomCanvas.width = gameWidth;
	columnBottomCanvas.height = gameHeight;
	titleCanvas.width = gameWidth;
	titleCanvas.height = gameHeight;
	ctxTitle.fillStyle = '#ffffff';
	ctxTitle.font = 'bold 30px Arial';
	infoCanvas.width = gameWidth;
	infoCanvas.height = gameHeight;
	ctxInfo.fillStyle = 'lightgrey';
	ctxInfo.font = '20px Arial';
	startScreenCanvas.width = gameWidth;
	startScreenCanvas.height = gameHeight;
	drawBackground();
	drawHero();
	drawColumn();
	document.addEventListener('keydown', checkKeyDown, false);
	document.addEventListener('keyup', checkKeyUp, false);
}

// счет в игре
var score = 0;

// все про героя
// переменные движения героя
var maxJump = -1.2 * 8,
	grav = 0.5 * 35,
	beginSpeed = 0;

// объект игры и его настройки
var playerObject = {};
playerObject.drawY = 150;
playerObject.isUp = false;
playerObject.drawX = 120;
playerObject.height = 50;
playerObject.width = 75;

// рисуем героя
function drawHero() {
	ctxGame.clearRect(0, 0, gameWidth, gameHeight);
	ctxGame.drawImage(imgHero, playerObject.drawX, playerObject.drawY, playerObject.width, playerObject.height); // сделал без параметров картинки, только канвас
	beginSpeed += grav * 0.05;
	playerObject.drawY += beginSpeed;
	if (playerObject.isUp) {
		beginSpeed = maxJump;
		ctxGame.clearRect(0, 0, gameWidth, gameHeight);
		ctxGame.drawImage(imgHeroUP, playerObject.drawX, playerObject.drawY, playerObject.width, playerObject.height);
	}
	if (playerObject.drawY <= 0) {
		beginSpeed = 0;
		playerObject.drawY = 0;
	}
	if (playerObject.drawY > gameHeight) {
		isPlaying = false;
	}
}

// все что с колоннами
// переменные для колонн
var rast = 160, //расстояние между колоннами
	max = 550, // макс расстояние появления колонн
	min = 220, // мин расстояние
	speedColumn = 10; // скорость колонн

var imgColumnBottom = new Image();
imgColumnBottom.src = 'img/Pl_Down.png';
var imgColumnTop = new Image();
imgColumnTop.src = 'img/Pl_Up.png';

var colonnObj = {};
colonnObj.drawX = 600;
colonnObj.drawY = (max - min) * Math.random() + min;
colonnObj.height = 598;
colonnObj.width = 92;

// рисую колонны
function drawColumn() {
	var randColumn = (max - min) * Math.random() + min;
	ctxColumnBottom.clearRect(0, 0, gameWidth, gameHeight);
	ctxColumnBottom.drawImage(imgColumnBottom, colonnObj.drawX, colonnObj.drawY, 70, 400);

	ctxColumnTop.clearRect(0, 0, gameWidth, gameHeight);
	ctxColumnTop.drawImage(imgColumnTop, colonnObj.drawX, colonnObj.drawY - rast - 400, 70, 400);

	colonnObj.drawX -= speedColumn;
	if (colonnObj.drawX < 0 - colonnObj.width) {
		colonnObj.drawX = gameWidth + colonnObj.width;
		colonnObj.drawY = randColumn;
		speedColumn += 0.03 * 15;
		rast = (160 - 100) * Math.random() + 100;
		score++;
	}
	// проверка пересечения с колоннами
	if (colonnObj.drawX < playerObject.drawX + playerObject.width / 2 &&
		colonnObj.drawX + colonnObj.width > playerObject.drawX &&
		colonnObj.drawY < playerObject.drawY + playerObject.height / 2 &&
		colonnObj.drawY + colonnObj.height >= playerObject.drawY + playerObject.height ||

		colonnObj.drawX < playerObject.drawX + playerObject.width / 2 &&
		colonnObj.drawX + colonnObj.width > playerObject.drawX &&
		colonnObj.drawY - rast > playerObject.drawY + playerObject.height / 2 &&
		colonnObj.drawY - rast + colonnObj.height >= playerObject.drawY + playerObject.height) {

		isPlaying = false;
		// document.getElementById('start').style.display = 'block';
	}
	ctxTitle.clearRect(0, 0, gameWidth, gameHeight);
	ctxTitle.fillText(`Счет: ${score}`, 20, 30);
	ctxInfo.clearRect(0, 0, gameWidth, gameHeight);
	let info = Math.round(speedColumn) * 10;
	ctxInfo.fillText(`Скорость колонн: ${info} км/ч`, 20, 50);
}

// логика игры
var isPlaying = false;
function START() {

	isPlaying = true;
	document.getElementById('start').style.display = 'none';
	document.getElementById('kirill').style.display = 'none';
	document.getElementById('bird').style.display = 'none';

	// игровой цикл

	//BUG после начать сначала без перезагрузки страницы не обнуляются парметры скорости для объектов
	setInterval(logic, 33);
	function logic() {
		if (isPlaying) {
			drawHero();
			drawColumn();
		} else {
			colonnObj.drawX = 600;
			speedColumn = 10;
			playerObject.drawY = 150;
			playerObject.drawX = 120;
			beginSpeed = 0;
			grav = 0.5 * 35;
			document.getElementById('start').style.display = 'block';
			document.getElementById('kirill').style.display = 'block';
			document.getElementById('bird').style.display = 'block';
		}
	}
}

// управление героем
function checkKeyDown(e) {
	var keyId = e.keyCode;
	if (keyId == '87') {
		playerObject.isUp = true;
	}
}
function checkKeyUp(e) {
	var keyId = e.keyCode;
	if (keyId == '87') {
		playerObject.isUp = false;
	}
}