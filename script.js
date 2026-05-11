// ── Config ──────────────────────────────────
const CORRECT_PASSWORD = "14/02/2026";
const MAX_ATTEMPTS     = 5;
const LOCKOUT_SECONDS  = 30;

// ── Elements ────────────────────────────────
const lockScreen   = document.getElementById('lock-screen');
const input        = document.getElementById('password-input');
const unlockBtn    = document.getElementById('unlock-btn');
const errorMsg     = document.getElementById('error-msg');
const attemptsLeft = document.getElementById('attempts-left');
const toggleVis    = document.getElementById('toggle-vis');

let attempts    = 0;
let lockoutTimer = null;

// ── ตรวจ sessionStorage ──────────────────────
// ถ้าเคยล็อกอินใน tab นี้แล้ว → ข้าม lock screen เลย
if (sessionStorage.getItem('isAuthenticated') === 'true') {
  lockScreen.classList.add('hidden');
}

// ── ฟังก์ชันตรวจรหัสผ่าน ────────────────────
function checkPassword() {
  const value = input.value.trim();

  if (!value) {
    showError("กรุณาใส่รหัสผ่าน");
    return;
  }

  if (value === CORRECT_PASSWORD) {
    sessionStorage.setItem('isAuthenticated', 'true');
    lockScreen.classList.add('hidden');
    input.value = '';
    clearError();
  } else {
    attempts++;
    triggerShake();

    const remaining = MAX_ATTEMPTS - attempts;

    if (attempts >= MAX_ATTEMPTS) {
      startLockout();
    } else {
      showError(`รหัสผ่านไม่ถูกต้อง — เหลืออีก ${remaining} ครั้ง`);
    }

    input.value = '';
    input.focus();
  }
}

// ── ล็อกชั่วคราว ─────────────────────────────
function startLockout() {
  let remaining = LOCKOUT_SECONDS;
  input.disabled = true;
  unlockBtn.disabled = true;
  input.style.opacity = '0.5';
  unlockBtn.style.opacity = '0.5';

  lockoutTimer = setInterval(() => {
    remaining--;
    showError(`ลองใหม่อีกครั้งใน ${remaining} วินาที...`);

    if (remaining <= 0) {
      clearInterval(lockoutTimer);
      attempts = 0;
      input.disabled = false;
      unlockBtn.disabled = false;
      input.style.opacity = '1';
      unlockBtn.style.opacity = '1';
      clearError();
      input.focus();
    }
  }, 1000);

  showError(`ลองใหม่อีกครั้งใน ${remaining} วินาที...`);
}

// ── Helper ───────────────────────────────────
function showError(msg) {
  errorMsg.textContent = msg;
}

function clearError() {
  errorMsg.textContent = '';
  attemptsLeft.textContent = '';
}

function triggerShake() {
  input.classList.add('error');
  setTimeout(() => input.classList.remove('error'), 500);
}

// ── Event Listeners ──────────────────────────
unlockBtn.addEventListener('click', checkPassword);

input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') checkPassword();
});

toggleVis.addEventListener('click', () => {
  if (input.type === 'password') {
    input.type = 'text';
    toggleVis.textContent = '🙈';
  } else {
    input.type = 'password';
    toggleVis.textContent = '👁';
  }
});

input.focus();
