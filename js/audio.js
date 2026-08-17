/**
 * Alle Sounds des Spiels. Der Schluessel dient als Name fuer playSound(),
 * startLoopSound() und stopSound().
 * @type {Object<string, HTMLAudioElement>}
 */
let sounds = {
  music: new Audio('audio/music.wav'),
  walk: new Audio('audio/walk.wav'),
  jump: new Audio('audio/jump.wav'),
  hurt: new Audio('audio/hurt.wav'),
  snore: new Audio('audio/snore.wav'),
  coin: new Audio('audio/coin.wav'),
  bottleCollect: new Audio('audio/bottle_collect.wav'),
  throwBottle: new Audio('audio/throw.wav'),
  splash: new Audio('audio/splash.wav'),
  chickenDead: new Audio('audio/chicken_dead.wav'),
  bossHurt: new Audio('audio/boss_hurt.wav'),
  win: new Audio('audio/win.wav'),
  lose: new Audio('audio/lose.wav'),
};

/** Sounds, die dauerhaft in einer Schleife laufen. */
const LOOPED_SOUNDS = ['music', 'walk', 'snore'];

/** Lautstaerken, die vom Standardwert abweichen. */
const SOUND_VOLUMES = {
  music: 0.2,
  walk: 0.25,
  snore: 0.35,
  coin: 0.4,
};

/** Lautstaerke fuer alle Sounds ohne eigenen Eintrag in SOUND_VOLUMES. */
const DEFAULT_VOLUME = 0.5;

/** Schluessel, unter dem der Mute-Status im Local Storage liegt. */
const MUTE_STORAGE_KEY = 'elPolloLocoMuted';

/** true, wenn alle Sounds stummgeschaltet sind. */
let isMuted = false;

/** Bereitet alle Sounds vor und stellt den gespeicherten Mute-Status wieder her. */
function initSounds() {
  LOOPED_SOUNDS.forEach((name) => {
    sounds[name].loop = true;
  });
  applyVolumes();
  loadMuteState();
}

/** Setzt die Lautstaerke jedes einzelnen Sounds. */
function applyVolumes() {
  for (let name in sounds) {
    let volume = SOUND_VOLUMES[name];
    if (!volume) {
      volume = DEFAULT_VOLUME;
    }
    sounds[name].volume = volume;
  }
}

/** Liest den Mute-Status aus dem Local Storage und zeigt ihn im Button an. */
function loadMuteState() {
  isMuted = localStorage.getItem(MUTE_STORAGE_KEY) === 'true';
  updateMuteButton();
}

/** Schaltet alle Sounds stumm oder wieder an und speichert den Status. */
function toggleMute() {
  isMuted = !isMuted;
  localStorage.setItem(MUTE_STORAGE_KEY, isMuted);
  updateMuteButton();
  if (isMuted) {
    stopAllSounds();
  } else if (world && world.isRunning) {
    startLoopSound('music');
  }
}

/** Tauscht das Icon des Mute-Buttons passend zum aktuellen Status. */
function updateMuteButton() {
  let icon = document.getElementById('muteIcon');
  if (isMuted) {
    icon.src = 'img/icons/sound-off.svg';
  } else {
    icon.src = 'img/icons/sound-on.svg';
  }
}

/**
 * Spielt einen einmaligen Soundeffekt von vorne ab.
 * @param {string} name - Schluessel aus dem sounds-Objekt.
 */
function playSound(name) {
  if (isMuted) {
    return;
  }
  sounds[name].currentTime = 0;
  startPlayback(sounds[name]);
}

/**
 * Startet einen Schleifen-Sound, falls er nicht bereits laeuft.
 * @param {string} name - Schluessel aus dem sounds-Objekt.
 */
function startLoopSound(name) {
  if (isMuted || !sounds[name].paused) {
    return;
  }
  startPlayback(sounds[name]);
}

/**
 * Startet die Wiedergabe. Der Browser lehnt play() ab, solange es keine
 * Nutzeraktion gab. Dieser Fall wird abgefangen, damit keine Konsolenfehler
 * entstehen.
 * @param {HTMLAudioElement} sound - Der abzuspielende Sound.
 */
function startPlayback(sound) {
  sound.play().catch(() => {});
}

/**
 * Pausiert einen Sound an der aktuellen Stelle.
 * @param {string} name - Schluessel aus dem sounds-Objekt.
 */
function pauseSound(name) {
  sounds[name].pause();
}

/**
 * Stoppt einen Sound und spult ihn an den Anfang zurueck.
 * @param {string} name - Schluessel aus dem sounds-Objekt.
 */
function stopSound(name) {
  sounds[name].pause();
  sounds[name].currentTime = 0;
}

/** Stoppt alle Sounds, zum Beispiel beim Spielende oder beim Stummschalten. */
function stopAllSounds() {
  for (let name in sounds) {
    stopSound(name);
  }
}
