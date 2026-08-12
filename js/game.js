let canvas;
let world;
let keyboard = new Keyboard();
let gamePaused = false;

function init() {
  canvas = document.getElementById('canvas');
  initLevel();
  world = new World(canvas, keyboard);

  console.log('My Character is', world.character);
}

function startGame() {
  document.getElementById('startScreen').classList.add('d-none');
  init();
}

function showControls() {
  document.getElementById('controlsDialog').showModal();
}

function hideControls() {
  document.getElementById('controlsDialog').close();
}

function showImpressum() {
  gamePaused = true;
  document.getElementById('impressumDialog').showModal();
}

function hideImpressum() {
  document.getElementById('impressumDialog').close();
}

function resumeGame() {
  gamePaused = false;
}

function stopGame() {
  world.isRunning = false;
  for (let i = 1; i < 9999; i++) {
    clearInterval(i);
  }
}

function showEndScreen(hasWon) {
  stopGame();
  world.showEndBackground = true;
  world.draw();

  let endImage = document.getElementById('endImage');
  if (hasWon) {
    endImage.src = 'img/You won, you lost/You Win A.png';
    endImage.classList.add('win-image');
  } else {
    endImage.src = 'img/You won, you lost/Game Over.png';
    endImage.classList.remove('win-image');
  }
  document.getElementById('endScreen').classList.remove('d-none');
}

function restartGame() {
  document.getElementById('endScreen').classList.add('d-none');
  init();
}

function backToHome() {
  document.getElementById('endScreen').classList.add('d-none');
  document.getElementById('startScreen').classList.remove('d-none');
}

window.addEventListener('keydown', (e) => {
  if (e.keyCode == 39 || e.keyCode == 76) {
    keyboard.RIGHT = true;
  }
  if (e.keyCode == 37 || e.keyCode == 74) {
    keyboard.LEFT = true;
  }
  if (e.keyCode == 38 || e.keyCode == 73) {
    keyboard.UP = true;
  }
  if (e.keyCode == 40 || e.keyCode == 75) {
    keyboard.DOWN = true;
  }
  if (e.keyCode == 32) {
    keyboard.SPACE = true;
  }
  if (e.keyCode == 68) {
    keyboard.D = true;
  }
});

window.addEventListener('keyup', (e) => {
  if (e.keyCode == 39 || e.keyCode == 76) {
    keyboard.RIGHT = false;
  }
  if (e.keyCode == 37 || e.keyCode == 74) {
    keyboard.LEFT = false;
  }
  if (e.keyCode == 38 || e.keyCode == 73) {
    keyboard.UP = false;
  }
  if (e.keyCode == 40 || e.keyCode == 75) {
    keyboard.DOWN = false;
  }
  if (e.keyCode == 32) {
    keyboard.SPACE = false;
  }
  if (e.keyCode == 68) {
    keyboard.D = false;
  }
});
