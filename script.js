const ballCount = 5;
const clink = 'clink';
let ballX = 240;
let canvas, stage, tweens, activeCount, text, frontlineX, backlineX, backlineY, lineEnd;

const init = () => {
	canvas = document.getElementById('testCanvas');
	stage = new createjs.Stage(canvas);
	createjs.Sound.registerSound("clink.mp3", clink);
	tweens = [];

	text = new createjs.Text('Click to start', '36px Arial', '#028a78');
	text.x = 300;
	text.y = 50;

	stage.addChild(text);

	const backFrame = new createjs.Shape();
	backFrame.graphics.beginFill("#555")
		.moveTo(-72, 390).lineTo(-45, 347).lineTo(615, 347).lineTo(637, 390)
		.beginFill('#777').drawRoundRectComplex(0, 0, 15, 355, 10, 0, 3, 3)
		.drawRoundRectComplex(0, 0, 570, 15, 10, 10, 0, 0)
		.drawRoundRectComplex(555, 0, 15, 355, 0, 10, 3, 3);
	backFrame.x = 115;
	backFrame.y = 155;

	stage.addChild(backFrame);

	for (let i = 0; i < ballCount; i++) {
		const ball = new createjs.Shape();

		switch (true) {
			case i === 0:
				frontlineX = 10;
				backlineX = 10;
				backlineY = 35;
				lineEnd = 2;
				tweens.push({ref: ball});
				break;
			case i === 1:
				frontlineX = 5;
				backlineX = 5;
				backlineY = 35;
				break;
			case i === 3:
				frontlineX = -5;
				backlineX = -5;
				backlineY = 35;
				break;
			case i === ballCount - 1:
				frontlineX = -10;
				backlineX = -10;
				backlineY = 35;
				tweens.push({ref: ball});
				break;
			default:
				frontlineX = 0;
				backlineX = 0;
				backlineY = 0;
		}

		ball.graphics.setStrokeStyle(2)
			.beginStroke('#aaa')
			.moveTo(-frontlineX, 20)
			.lineTo(0, 300)
			.beginStroke('#777')
			.moveTo(backlineX, backlineY)
			.lineTo(0, 300)
			.endStroke()
			.beginLinearGradientFill(['#FFF', '#999'], [0.8, 1], -20, 180, 20, 320).drawCircle(0, 300, 40);
		ball.x = ballX;
		ball.y = 130;

		stage.addChild(ball);

		ballX += 80;
	}

	const frontFrame = new createjs.Shape();
	frontFrame.graphics.beginFill('#999')
		.drawRoundRectComplex(0, 0, 20, 405, 10, 0, 5, 5)
		.drawRoundRectComplex(0, 0, 615, 20, 10, 10, 0, 0)
		.drawRoundRectComplex(600, 0, 20, 405, 0, 10, 5, 5)
		.beginFill('#444').drawRoundRectComplex(-50, 410, 715, 20, 10, 10, 0, 0);
	frontFrame.x = 90;
	frontFrame.y = 130;

	stage.addChild(frontFrame);

	activeCount = ballCount;
	stage.addEventListener('stagemouseup', startNewtonsCradle);

	createjs.Ticker.addEventListener('tick', tick);
}

const playClink = () => createjs.Sound.play(clink);

const startNewtonsCradle = event => {
	stage.removeEventListener('stagemouseup', startNewtonsCradle);
	stage.removeChild(text);

	const firstBall = tweens[0].ref;
	const lastBall = tweens[1].ref;

	createjs.Tween.get(firstBall, {loop: -1})
		.to({rotation: 40}, 400)
		.wait(100)
		.to({rotation: 0, rotationDir: 0}, 150)
		.call(playClink)
		.wait(700);

	createjs.Tween.get(lastBall, {loop: -1})
		.wait(700)
		.to({rotation: -40}, 400)
		.wait(100)
		.to({rotation: 0, rotationDir: 0}, 150)
		.call(playClink);
}

const tick = event => {
	if (activeCount) {
		stage.update(event);
	}
}

const loadSound = () => {
	const preload = new createjs.LoadQueue();
	preload.addEventListener("fileload", init);
	preload.loadFile("clink.mp3");
}

window.addEventListener('load', () => {
	loadSound();
});
