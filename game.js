const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const tileSize = 40;
let tilesX = Math.ceil(canvas.width / tileSize);
let tilesY = Math.ceil(canvas.height / tileSize);

let world = Array(tilesY).fill().map((_, y) =>
  Array(tilesX).fill(y > tilesY / 2 ? 1 : 0)
);

const player = {
  x: Math.floor(tilesX / 2),
  y: Math.floor(tilesY / 2 - 2),
  dx: 0,
  dy: 0,
  size: 1,
  onGround: false,
  facing: 1, // 1 = right, -1 = left
};

const gravity = 0.2;
const jumpStrength = -5;
const speed = 0.1;

const blockTypes = {
  1: '#654321', // Dirt
  2: '#808080', // Stone
  3: '#228B22', // Grass
};

let keys = {};
let mobileControls = { left: false, right: false, jump: false };

function drawWorld() {
  for (let y = 0; y < tilesY; y++) {
    for (let x = 0; x < tilesX; x++) {
      ctx.fillStyle = world[y][x] > 0 ? blockTypes[world[y][x]] : '#87CEEB';
      ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
    }
  }
}

function drawPlayer() {
  ctx.fillStyle = 'red';
  ctx.fillRect(player.x * tileSize, player.y * tileSize, tileSize, tileSize);
}

function drawPlayer() {
  ctx.fillStyle = 'red';
  ctx.fillRect(player.x * tileSize, player.y * tileSize, tileSize, tileSize);
}

function updatePlayer() {
  // Apply gravity
  player.dy += gravity;

  // Horizontal movement
  player.x += player.dx;

  // Vertical movement
  player.y += player.dy;

  // Collision detection (ground)
  const leftTile = Math.floor(player.x);
  const rightTile = Math.floor(player.x + player.size);
  const bottomTile = Math.floor(player.y + player.size);

  if (
    (world[bottomTile] && world[bottomTile][leftTile] > 0) ||
    (world[bottomTile] && world[bottomTile][rightTile] > 0)
  ) {
    player.y = Math.floor(player.y); // Correct the player's vertical position
    player.dy = 0;
    player.onGround = true;
  } else {
    player.onGround = false;
  }

  // Prevent out-of-bounds movement
  player.x = Math.max(0, Math.min(player.x, tilesX - player.size));
  player.y = Math.min(player.y, tilesY - player.size);
}

function handleMovement() {
  if (keys['ArrowLeft'] || keys['a'] || mobileControls.left) {
    player.dx = -speed;
    player.facing = -1;
  } else if (keys['ArrowRight'] || keys['d'] || mobileControls.right) {
    player.dx = speed;
    player.facing = 1;
  } else {
    player.dx = 0;
  }

  if (
    (keys['ArrowUp'] || keys[' '] || keys['w'] || mobileControls.jump) &&
    player.onGround
  ) {
    player.dy = jumpStrength;
  }
}

function placeBlock() {
  const blockType = parseInt(document.getElementById('blockType').value);
  const targetX = Math.floor(player.x + player.facing);
  const targetY = Math.floor(player.y + player.size - 1);

  if (
    targetX >= 0 &&
    targetX < tilesX &&
    targetY >= 0 &&
    targetY < tilesY &&
    world[targetY][targetX] === 0
  ) {
    world[targetY][targetX] = blockType;
  }
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawWorld();
  drawPlayer();
  handleMovement();
  updatePlayer();
  requestAnimationFrame(gameLoop);
}

window.addEventListener('keydown', (e) => (keys[e.key] = true));
window.addEventListener('keyup', (e) => (keys[e.key] = false));

document.getElementById('left').addEventListener('mousedown', () => (mobileControls.left = true));
document.getElementById('left').addEventListener('mouseup', () => (mobileControls.left = false));
document.getElementById('right').addEventListener('mousedown', () => (mobileControls.right = true));
document.getElementById('right').addEventListener('mouseup', () => (mobileControls.right = false));
document.getElementById('jump').addEventListener('mousedown', () => (mobileControls.jump = true));
document.getElementById('jump').addEventListener('mouseup', () => (mobileControls.jump = false));

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  tilesX = Math.ceil(canvas.width / tileSize);
  tilesY = Math.ceil(canvas.height / tileSize);
});

document.getElementById('build').addEventListener('click', placeBlock);

gameLoop();