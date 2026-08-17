/**
 * All sounds used in the game. The key is used as the name for playSound(),
 * startLoopSound(), and stopSound().
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
  bottleBreak: new Audio('audio/bottle_break.wav'),
  chickenDead: new Audio('audio/chicken_dead.wav'),
  bossHurt: new Audio('audio/boss_hurt.wav'),
  win: new Audio('audio/win.wav'),
  lose: new Audio('audio/lose.wav'),
};

/** Sounds that continuously play in a loop. */
const LOOPED_SOUNDS = ['music', 'walk', 'snore'];

/** Volume levels that differ from the default value. */
const SOUND_VOLUMES = {
  music: 0.2,
  walk: 0.25,
  snore: 0.35,
  coin: 0.4,
  throwBottle: 0.55,
  bottleBreak: 0.6,
};

/** Volume used for all sounds without their own entry in SOUND_VOLUMES. */
const DEFAULT_VOLUME = 0.5;

/** Key under which the mute state is stored in Local Storage. */
const MUTE_STORAGE_KEY = 'elPolloLocoMuted';

/** true if all sounds are muted. */
let isMuted = false;

/** Prepares all sounds and restores the saved mute state. */
function initSounds() {
  LOOPED_SOUNDS.forEach((name) => {
    sounds[name].loop = true;
  });
  applyVolumes();
  loadMuteState();
}

/** Sets the volume of each individual sound. */
function applyVolumes() {
  for (let name in sounds) {
    let volume = SOUND_VOLUMES[name];
    if (!volume) {
      volume = DEFAULT_VOLUME;
    }
    sounds[name].volume = volume;
  }
}

/** Reads the mute state from Local Storage and reflects it in the button. */
function loadMuteState() {
  isMuted = localStorage.getItem(MUTE_STORAGE_KEY) === 'true';
  updateMuteButton();
}

/** Mutes or unmutes all sounds and saves the state. */
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

/** Updates the mute button icon to match the current state. */
function updateMuteButton() {
  let icon = document.getElementById('muteIcon');
  if (isMuted) {
    icon.src = 'img/icons/sound-off.svg';
  } else {
    icon.src = 'img/icons/sound-on.svg';
  }
}

/**
 * Plays a one-time sound effect from the beginning.
 * @param {string} name - Key from the sounds object.
 */
function playSound(name) {
  if (isMuted) {
    return;
  }
  sounds[name].currentTime = 0;
  startPlayback(sounds[name]);
}

/**
 * Starts a looping sound if it is not already playing.
 * @param {string} name - Key from the sounds object.
 */
function startLoopSound(name) {
  if (isMuted || !sounds[name].paused) {
    return;
  }
  startPlayback(sounds[name]);
}

/**
 * Starts playback. The browser may reject play() until there has been a user
 * interaction. This case is handled to prevent console errors.
 * @param {HTMLAudioElement} sound - The sound to be played.
 */
function startPlayback(sound) {
  sound.play().catch(() => {});
}

/**
 * Pauses a sound at its current position.
 * @param {string} name - Key from the sounds object.
 */
function pauseSound(name) {
  sounds[name].pause();
}

/**
 * Stops a sound and resets it to the beginning.
 * @param {string} name - Key from the sounds object.
 */
function stopSound(name) {
  sounds[name].pause();
  sounds[name].currentTime = 0;
}

/** Stops all sounds, for example when the game ends or is muted. */
function stopAllSounds() {
  for (let name in sounds) {
    stopSound(name);
  }
}
