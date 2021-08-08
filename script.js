const ballCount = 5;
const clink = 'clink';
let lineX = 240;
let canvas, stage, tweens, activeCount, text;

const init = () => {
	canvas = document.getElementById('testCanvas');
	stage = new createjs.Stage(canvas);
	createjs.Sound.registerSound("clink.mp3", clink);
	tweens = [];

	text = new createjs.Text('Click to start', '36px Arial', '#028a78');
	text.x = 300;
	text.y = 50;

	stage.addChild(text);

	for (let i = 0; i < ballCount; i++) {
		const ball = new createjs.Shape();
		ball.graphics.beginFill('#555')
			.drawRect(0, 0, 2, 300)
			.beginLinearGradientFill(['#FFF', '#999'], [0.8, 1], -20, 180, 20, 320).drawCircle(0, 300, 40);
		ball.x = lineX;
		ball.y = 150;

		if (i === 0 || i === ballCount -1) {
			tweens.push({ref: ball});
		}

		stage.addChild(ball);

		lineX += 80;
	}

	const frame = new createjs.Shape();
	frame.graphics.beginFill('#777')
		.drawRoundRectComplex(0, 0, 20, 400, 10, 0, 0, 0)
		.drawRoundRectComplex(0, 0, 615, 20, 10, 10, 0, 0)
		.drawRoundRectComplex(600, 0, 20, 400, 0, 10, 0, 0)
		.beginFill('#444').drawRoundRectComplex(-50, 400, 715, 20, 10, 10, 0, 0);
	frame.x = 90;
	frame.y = 130;

	stage.addChild(frame);

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
		.call(playClink);;


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
