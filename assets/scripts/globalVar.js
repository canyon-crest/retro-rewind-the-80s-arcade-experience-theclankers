export var DDEBUG = DDEBUG || {};

DDEBUG.full = true;

let debugToggle = document.querySelector('#debug-toggle');

function updateDebugToggle() {
  if (!debugToggle) return;
  debugToggle.textContent = `Debug: ${DDEBUG.full ? 'On' : 'Off'}`;
  debugToggle.setAttribute('aria-pressed', DDEBUG.full);
}

if (debugToggle) {
  debugToggle.addEventListener('click', () => {
    DDEBUG.full = !DDEBUG.full;
    updateDebugToggle();
  });
}
updateDebugToggle();