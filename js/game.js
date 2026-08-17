/**
 * Das Canvas, auf das die Spielwelt gezeichnet wird.
 * @type {HTMLCanvasElement}
 */
let canvas;

/**
 * Die laufende Spielwelt. Vor dem ersten Spielstart noch undefined.
 * @type {World}
 */
let world;

/** Status aller Tasten. Tastatur und Touch-Buttons schreiben hier hinein. */
let keyboard = new Keyboard();

/** true, solange das Impressum offen ist und das Spiel deshalb pausiert. */
let gamePaused = false;

/**
 * Ordnet Tastencodes den Feldern des Keyboard-Objekts zu.
 * @type {Object<number, string>}
 */
const KEY_CODES = {
  37: 'LEFT',
  74: 'LEFT',
  39: 'RIGHT',
  76: 'RIGHT',
  38: 'UP',
  73: 'UP',
  40: 'DOWN',
  75: 'DOWN',
  32: 'SPACE',
  68: 'D',
};

/**
 * Ordnet die Touch-Buttons den Feldern des Keyboard-Objekts zu.
 * @type {Object<string, string>}
 */
const TOUCH_BUTTONS = {
  btnLeft: 'LEFT',
  btnRight: 'RIGHT',
  btnJump: 'SPACE',
  btnThrow: 'D',
};

/** Erzeugt das Level und die Spielwelt auf dem Canvas. */
function init() {
  canvas = document.getElementById('canvas');
  initLevel();
  world = new World(canvas, keyboard);
}

/** Startet das Spiel vom Startbildschirm aus. */
function startGame() {
  document.getElementById('startScreen').classList.add('d-none');
  showGameControls();
  init();
  startLoopSound('music');
}

/** Startet das Spiel nach dem Endbildschirm neu, ohne die Seite neu zu laden. */
function restartGame() {
  document.getElementById('endScreen').classList.add('d-none');
  showGameControls();
  init();
  startLoopSound('music');
}

/**
 * Kehrt zum Startbildschirm zurueck. Laeuft gerade ein Spiel, wird es vorher
 * beendet, damit im Hintergrund nichts weiterlaeuft.
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

/** Beendet alle laufenden Intervalle des Spiels. */
function stopGame() {
  world.isRunning = false;
  for (let i = 1; i < 9999; i++) {
    clearInterval(i);
  }
}

/**
 * Zeigt den Endbildschirm mit Sieg- oder Niederlage-Grafik.
 * @param {boolean} hasWon - true, wenn der Endboss besiegt wurde.
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
 * Waehlt die Grafik des Endbildschirms aus.
 * @param {boolean} hasWon - true, wenn der Endboss besiegt wurde.
 */
function setEndImage(hasWon) {
  let endImage = document.getElementById('endImage');
  if (hasWon) {
    endImage.src = 'img/You won, you lost/You Win A.png';
    endImage.classList.add('win-image');
  } else {
    endImage.src = 'img/You won, you lost/Game Over.png';
    endImage.classList.remove('win-image');
  }
}

/**
 * Spielt den passenden Sound zum Spielende.
 * @param {boolean} hasWon - true, wenn der Endboss besiegt wurde.
 */
function playEndSound(hasWon) {
  if (hasWon) {
    playSound('win');
  } else {
    playSound('lose');
  }
}

/** Blendet Touch-Buttons und Home-Button ein, die nur im Spiel gebraucht werden. */
function showGameControls() {
  document.getElementById('touchControls').classList.remove('d-none');
  document.getElementById('btnHome').classList.remove('d-none');
}

/** Blendet Touch-Buttons und Home-Button wieder aus. */
function hideGameControls() {
  document.getElementById('touchControls').classList.add('d-none');
  document.getElementById('btnHome').classList.add('d-none');
}

/** Oeffnet den Dialog mit der Tastenbelegung. */
function showControls() {
  document.getElementById('controlsDialog').showModal();
}

/** Schliesst den Dialog mit der Tastenbelegung. */
function hideControls() {
  document.getElementById('controlsDialog').close();
}

/** Pausiert das Spiel und oeffnet das Impressum. */
function showImpressum() {
  pauseGame();
  document.getElementById('impressumDialog').showModal();
}

/** Schliesst das Impressum. */
function hideImpressum() {
  document.getElementById('impressumDialog').close();
}

/** Haelt das Spiel an und stoppt die Sounds, die sonst weiterlaufen wuerden. */
function pauseGame() {
  gamePaused = true;
  pauseSound('music');
  stopSound('walk');
  stopSound('snore');
}

/** Setzt das Spiel fort und startet die Hintergrundmusik wieder. */
function resumeGame() {
  gamePaused = false;
  if (world && world.isRunning) {
    startLoopSound('music');
  }
}

/**
 * Prueft, ob der Hinweis "Turn your device to play" gerade sichtbar ist.
 * Wann er erscheint, entscheidet allein die Media Query in mobile.css.
 * @returns {boolean} true, wenn der Hinweis das Spiel verdeckt.
 */
function isRotateScreenVisible() {
  let rotateScreen = document.getElementById('rotateScreen');
  return getComputedStyle(rotateScreen).display !== 'none';
}

/**
 * Pausiert das Spiel, solange das Geraet hochkant gehalten wird oder das
 * Impressum offen ist, und setzt es fort, sobald beides nicht mehr zutrifft.
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
 * Setzt den Status einer Taste im Keyboard-Objekt.
 * @param {number} keyCode - Code der gedrueckten Taste.
 * @param {boolean} isPressed - true beim Druecken, false beim Loslassen.
 */
function setKeyState(keyCode, isPressed) {
  let key = KEY_CODES[keyCode];
  if (key) {
    keyboard[key] = isPressed;
  }
}

/** Verbindet alle Touch-Buttons mit dem Keyboard-Objekt. */
function bindTouchButtons() {
  for (let buttonId in TOUCH_BUTTONS) {
    bindTouchButton(buttonId, TOUCH_BUTTONS[buttonId]);
  }
}

/**
 * Verbindet einen Touch-Button mit einer Taste des Keyboard-Objekts.
 * Solange der Button gedrueckt wird, ist die Taste auf true gesetzt.
 * @param {string} buttonId - id des Buttons im HTML.
 * @param {string} key - Feldname im Keyboard-Objekt.
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
 * Setzt die Taste beim Druecken auf true.
 * @param {Event} event - Touch- oder Maus-Event des Buttons.
 * @param {string} key - Feldname im Keyboard-Objekt.
 */
function pressTouchKey(event, key) {
  event.preventDefault();
  keyboard[key] = true;
}

/**
 * Setzt die Taste beim Loslassen auf false.
 * @param {Event} event - Touch- oder Maus-Event des Buttons.
 * @param {string} key - Feldname im Keyboard-Objekt.
 */
function releaseTouchKey(event, key) {
  event.preventDefault();
  keyboard[key] = false;
}

/**
 * Unterdrueckt die Standardaktion, zum Beispiel das Kontextmenue.
 * @param {Event} event - Das ausgeloeste Event.
 */
function preventDefaultEvent(event) {
  event.preventDefault();
}

/** Sorgt dafuer, dass sich jeder Dialog per Klick daneben schliesst. */
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
