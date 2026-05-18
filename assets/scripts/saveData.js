const SAVE_KEY = 'retroRewindSaveData';

export const ABILITIES = Object.freeze({
  DOUBLE_JUMP: 'doubleJump',
  WALL_CLING: 'wallCling',
  DASH: 'dash'
});

const DEFAULT_SAVE_DATA = Object.freeze({
  abilities: Object.freeze({
    [ABILITIES.DOUBLE_JUMP]: false,
    [ABILITIES.WALL_CLING]: false,
    [ABILITIES.DASH]: false
  })
});

function cloneDefaultSaveData() {
  return {
    abilities: { ...DEFAULT_SAVE_DATA.abilities }
  };
}

function normalizeSaveData(saveData) {
  let normalized = cloneDefaultSaveData();

  if (saveData?.abilities) {
    for (let ability of Object.values(ABILITIES)) {
      normalized.abilities[ability] = saveData.abilities[ability] === true;
    }
  }

  return normalized;
}

function storageAvailable() {
  try {
    return typeof localStorage !== 'undefined';
  } catch {
    return false;
  }
}

export function loadSaveData() {
  if (!storageAvailable()) return cloneDefaultSaveData();

  try {
    let rawSaveData = localStorage.getItem(SAVE_KEY);
    if (!rawSaveData) return cloneDefaultSaveData();

    return normalizeSaveData(JSON.parse(rawSaveData));
  } catch (error) {
    console.warn('Could not load save data. Starting with defaults.', error);
    return cloneDefaultSaveData();
  }
}

export function saveSaveData(saveData) {
  let normalized = normalizeSaveData(saveData);

  if (storageAvailable()) {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(normalized));
    } catch (error) {
      console.warn('Could not save data.', error);
    }
  }

  return normalized;
}

export function resetSaveData() {
  let saveData = cloneDefaultSaveData();
  saveSaveData(saveData);
  return saveData;
}
