/**
 * The canvas on which the game world is drawn.
 * @type {HTMLCanvasElement}
 */
let canvas;

/**
 * The currently running game world. Undefined before the first game starts.
 * @type {World}
 */
let world;

/** Stores the state of all keys. Keyboard and touch buttons write to this object. */
let keyboard = new Keyboard();

/** true while the legal notice is open and the game is therefore paused. */
let gamePaused = false;

/**
 * Maps key codes to properties of the Keyboard object.
 * Contains exactly the keys shown in the controls dialog.
 * @type {Object<number, string>}
 */
const KEY_CODES = {
  37: 'LEFT',
  39: 'RIGHT',
  38: 'UP',
  32: 'SPACE',
  68: 'D',
};

/**
 * Maps touch buttons to properties of the Keyboard object.
 * @type {Object<string, string>}
 */
const TOUCH_BUTTONS = {
  btnLeft: 'LEFT',
  btnRight: 'RIGHT',
  btnJump: 'SPACE',
  btnThrow: 'D',
};

/** Creates the level and game world on the canvas. */
function init() {
  canvas = document.getElementById('canvas');
  initLevel();
  world = new World(canvas, keyboard);
}

/** Starts the game from the start screen. */
function startGame() {
  document.getElementById('startScreen').classList.add('d-none');
  showGameControls();
  init();
  startLoopSound('music');
}

/** Restarts the game after the end screen without reloading the page. */
function restartGame() {
  document.getElementById('endScreen').classList.add('d-none');
  showGameControls();
  init();
  startLoopSound('music');
}

/**
 * Returns to the start screen. If a game is running, it is stopped first
 * so that nothing continues running in the background.
 */
function backToHome() {
  if (world) {
    stopGame();
  }
  document.getElementById('endScreen').classList.add('d-none');
  document.getElementById('startScreen').classList.remove('d-none');
  hideGameControls();
  stopAllSounds();
}

/** Stops all running game intervals. */
function stopGame() {
  world.isRunning = false;
  for (let i = 1; i < 9999; i++) {
    clearInterval(i);
  }
}

/**
 * Shows the end screen with the victory or defeat graphic.
 * @param {boolean} hasWon - true if the end boss was defeated.
 */
function showEndScreen(hasWon) {
  stopGame();
  hideGameControls();
  stopAllSounds();
  world.showEndBackground = true;
  world.draw();
  setEndImage(hasWon);
  playEndSound(hasWon);
  document.getElementById('endScreen').classList.remove('d-none');
}

/**
 * Selects the graphic for the end screen. The alt text is updated as well
 * because the image is the only place that indicates victory or defeat.
 * @param {boolean} hasWon - true if the end boss was defeated.
 */
function setEndImage(hasWon) {
  let endImage = document.getElementById('endImage');
  if (hasWon) {
    endImage.src = 'img/9_intro_outro_screens/end/you_win.png';
    endImage.alt = 'Gewonnen';
    endImage.classList.add('win-image');
  } else {
    endImage.src = 'img/9_intro_outro_screens/end/game_over.png';
    endImage.alt = 'Game Over';
    endImage.classList.remove('win-image');
  }
}

/**
 * Plays the appropriate sound for the end of the game.
 * @param {boolean} hasWon - true if the end boss was defeated.
 */
function playEndSound(hasWon) {
  if (hasWon) {
    playSound('win');
  } else {
    playSound('lose');
  }
}

/** Shows the touch buttons and home button that are only needed during the game. */
function showGameControls() {
  document.getElementById('touchControls').classList.remove('d-none');
  document.getElementById('btnHome').classList.remove('d-none');
}

/** Hides the touch buttons and home button again. */
function hideGameControls() {
  document.getElementById('touchControls').classList.add('d-none');
  document.getElementById('btnHome').classList.add('d-none');
}

/** Opens the dialog showing the controls. */
function showControls() {
  document.getElementById('controlsDialog').showModal();
}

/** Closes the dialog showing the controls. */
function hideControls() {
  document.getElementById('controlsDialog').close();
}

/** Pauses the game and opens the legal notice. */
function showImpressum() {
  pauseGame();
  document.getElementById('impressumDialog').showModal();
}

/** Closes the legal notice. */
function hideImpressum() {
  document.getElementById('impressumDialog').close();
}

/** Pauses the game and stops sounds that would otherwise keep playing. */
function pauseGame() {
  gamePaused = true;
  pauseSound('music');
  stopSound('walk');
  stopSound('snore');
}

/** Resumes the game and restarts the background music. */
function resumeGame() {
  gamePaused = false;
  if (world && world.isRunning) {
    startLoopSound('music');
  }
}

/**
 * Checks whether the "Turn your device to play" message is currently visible.
 * Its visibility is controlled solely by the media query in mobile.css.
 * @returns {boolean} true if the message is covering the game.
 */
function isRotateScreenVisible() {
  let rotateScreen = document.getElementById('rotateScreen');
  return getComputedStyle(rotateScreen).display !== 'none';
}

/**
 * Pauses the game while the device is held in portrait mode or the legal notice
 * is open, and resumes it once neither condition applies.
 */
function updateGameState() {
  let impressumOpen = document.getElementById('impressumDialog').open;
  if (isRotateScreenVisible() || impressumOpen) {
    pauseGame();
  } else {
    resumeGame();
  }
}

/**
 * Sets the state of a key in the Keyboard object.
 * @param {number} keyCode - Code of the pressed key.
 * @param {boolean} isPressed - true when pressed, false when released.
 */
function setKeyState(keyCode, isPressed) {
  let key = KEY_CODES[keyCode];
  if (key) {
    keyboard[key] = isPressed;
  }
}

/** Connects all touch buttons to the Keyboard object. */
function bindTouchButtons() {
  for (let buttonId in TOUCH_BUTTONS) {
    bindTouchButton(buttonId, TOUCH_BUTTONS[buttonId]);
  }
}

/**
 * Connects a touch button to a key in the Keyboard object.
 * The key remains true for as long as the button is pressed.
 * @param {string} buttonId - ID of the button in the HTML.
 * @param {string} key - Property name in the Keyboard object.
 */
function bindTouchButton(buttonId, key) {
  let button = document.getElementById(buttonId);
  let press = (event) => pressTouchKey(event, key);
  let release = (event) => releaseTouchKey(event, key);
  button.addEventListener('touchstart', press, { passive: false });
  button.addEventListener('touchend', release, { passive: false });
  button.addEventListener('touchcancel', release);
  button.addEventListener('mousedown', press);
  button.addEventListener('mouseup', release);
  button.addEventListener('mouseleave', release);
  button.addEventListener('contextmenu', preventDefaultEvent);
}

/**
 * Sets the key to true when pressed.
 * @param {Event} event - Touch or mouse event of the button.
 * @param {string} key - Property name in the Keyboard object.
 */
function pressTouchKey(event, key) {
  event.preventDefault();
  keyboard[key] = true;
}

/**
 * Sets the key to false when released.
 * @param {Event} event - Touch or mouse event of the button.
 * @param {string} key - Property name in the Keyboard object.
 */
function releaseTouchKey(event, key) {
  event.preventDefault();
  keyboard[key] = false;
}

/**
 * Prevents the default action, such as opening the context menu.
 * @param {Event} event - The triggered event.
 */
function preventDefaultEvent(event) {
  event.preventDefault();
}

/** Allows each dialog to be closed by clicking on its backdrop. */
function bindDialogBackdropClose() {
  document.querySelectorAll('dialog').forEach((dialog) => {
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) {
        dialog.close();
      }
    });
  });
}

window.addEventListener('keydown', (event) => {
  setKeyState(event.keyCode, true);
});

window.addEventListener('keyup', (event) => {
  setKeyState(event.keyCode, false);
});

window.addEventListener('resize', updateGameState);

document.addEventListener('DOMContentLoaded', () => {
  initSounds();
  bindTouchButtons();
  bindDialogBackdropClose();
});
