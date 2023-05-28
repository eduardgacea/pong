'use strict';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const W = canvas.width;
const H = canvas.height;

const player1ScoreDisplay = document.getElementById('player1-score');
const player2ScoreDisplay = document.getElementById('player2-score');

const paddleWidth = 10;
const paddleLength = 100;
const paddleSpeed = 4;
const ballSpeed = 2.5;

let isPlaying = false;
let player1Score = 0;
let player2Score = 0;

class Ball {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.vx = 0;
    this.vy = 0;
  }
  display() {
    ctx.save();
    ctx.fillStyle = 'green';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    ctx.fill();
    ctx.restore();
  }
  update() {
    if (this.y <= this.r || this.y > H - this.r) this.vy = -this.vy;
    this.x += this.vx;
    this.y += this.vy;
  }
}

class Paddle {
  constructor(x, y, rl) {
    this.rl = rl;
    this.x = x;
    this.y = y;
  }
  display() {
    ctx.save();
    ctx.fillStyle = 'black';
    ctx.fillRect(this.x, this.y, paddleWidth, paddleLength);
    ctx.restore();
  }
}

const ball = new Ball(W / 2, H / 2, 16);
const paddleL = new Paddle(0, H / 2, 'l');
const paddleR = new Paddle(W - paddleWidth, H / 2, 'r');

const keys = {
  ArrowUp: false,
  ArrowDown: false,
  w: false,
  s: false,
};

(function setup() {})();

(function draw() {
  setBackground('rgb(150,150,150)');
  ball.display();
  ball.update();
  // paddle movement
  if (keys.ArrowUp && paddleR.y > 0) paddleR.y -= paddleSpeed;
  if (keys.ArrowDown && paddleR.y < H - paddleLength) paddleR.y += paddleSpeed;
  if (keys.w && paddleL.y > 0) paddleL.y -= paddleSpeed;
  if (keys.s && paddleL.y < H - paddleLength) paddleL.y += paddleSpeed;
  paddleL.display();
  paddleR.display();
  // paddle - ball collision
  if (0 < ball.x && ball.x <= ball.r && paddleL.y <= ball.y && ball.y <= paddleL.y + paddleLength) ball.vx = -ball.vx;
  if (W - paddleWidth - ball.r <= ball.x && ball.x < W && paddleR.y <= ball.y && ball.y <= paddleR.y + paddleLength) ball.vx = -ball.vx;
  // endgame
  if (ball.x <= 0 || ball.x >= W) {
    if (ball.x <= 0) player2Score++;
    if (ball.x >= W) player1Score++;
    isPlaying = false;
    ball.x = W / 2;
    ball.y = H / 2;
    ball.vx = 0;
    ball.vy = 0;
    player1ScoreDisplay.textContent = player1Score;
    player2ScoreDisplay.textContent = player2Score;
  }
  requestAnimationFrame(draw);
})();

function setBackground(style) {
  ctx.fillStyle = style;
  ctx.fillRect(0, 0, W, H);
}

document.addEventListener('keydown', e => {
  handleKeyBoardInput(e.key, true);
});

document.addEventListener('keyup', e => {
  handleKeyBoardInput(e.key, false);
});

document.addEventListener('keypress', e => {
  if (e.key === ' ' && !isPlaying) {
    const seedX = Math.random() < 0.5 ? -1 : 1;
    const seedY = Math.random() < 0.5 ? -1 : 1;
    isPlaying = true;
    ball.vx = seedX * ballSpeed;
    ball.vy = seedY * ballSpeed;
  }
});

function handleKeyBoardInput(key, isPressed) {
  if (keys.hasOwnProperty(key)) {
    keys[key] = isPressed;
  }
}
