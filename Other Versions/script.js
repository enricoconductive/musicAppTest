document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById('startButton');
  const overlay = document.getElementById('overlay');
  const noteGrid = document.getElementById('noteGrid');
  const octaveDisplay = document.getElementById('octave-display');
  const octaveDown = document.getElementById('octave-down');
  const octaveUp = document.getElementById('octave-up');

  let synth;
  let activeKeys = {};
  let currentOctave = 4;

  const baseFrequencies = {
    C4: 261.63,
    D4: 293.66,
    E4: 329.63,
    F4: 349.23,
    G4: 392.00,
    A4: 440.00
  };

  function getMultiplier(octave) {
    return Math.pow(2, octave - 4);
  }

  const keyMap = {
    a: "C4", s: "D4", d: "E4", f: "F4", g: "G4", h: "A4",
    ArrowLeft: "C4", ArrowUp: "D4", ArrowRight: "E4",
    ArrowDown: "G4", " ": "A4"
  };

  function updateOctaveDisplay() {
  if (!octaveDisplay) return;
  const label = currentOctave === 3 ? 'Lo' : currentOctave === 4 ? 'Mid' : 'Hi';
  octaveDisplay.textContent = `${label}`;
  }

  function releaseAllNotes() {
  synth.releaseAll();
  // Also remove 'active' style from all keys
  document.querySelectorAll('.white-key').forEach(key => {
    key.classList.remove('active');
  });
  // Clear activeKeys state
  activeKeys = {};
  }


  if (octaveUp) {
  octaveUp.addEventListener('click', () => {
    if (currentOctave < 5) {
      releaseAllNotes();         // <- important!
      currentOctave++;
      updateOctaveDisplay();
    }
  });
  }

  if (octaveDown) {
  octaveDown.addEventListener('click', () => {
    if (currentOctave > 3) {
      releaseAllNotes();         // <- important!
      currentOctave--;
      updateOctaveDisplay();
    }
  });
  }


  startBtn.addEventListener('click', async () => {
    await Tone.start();
    synth = new Tone.PolySynth(Tone.Synth).toDestination();
    overlay.style.display = 'none';
    noteGrid.style.display = 'flex';
    document.querySelector('.octave-control').style.display = 'flex';
    updateOctaveDisplay();

    document.querySelectorAll('.white-key').forEach(key => {
      const noteName = key.dataset.note;
      const baseFreq = baseFrequencies[noteName];

      const triggerOn = () => {
        synth.triggerAttack(baseFreq * getMultiplier(currentOctave));
        key.classList.add('active');
      };
      const triggerOff = () => {
        synth.triggerRelease(baseFreq * getMultiplier(currentOctave));
        key.classList.remove('active');
      };

      key.addEventListener('mousedown', triggerOn);
      key.addEventListener('mouseup', triggerOff);
      key.addEventListener('mouseleave', triggerOff);

      key.addEventListener('touchstart', e => { e.preventDefault(); triggerOn(); }, { passive: false });
      key.addEventListener('touchend', e => { e.preventDefault(); triggerOff(); }, { passive: false });
      key.addEventListener('touchcancel', e => { e.preventDefault(); triggerOff(); }, { passive: false });
    });

    document.addEventListener('keydown', e => {
      const k = e.key;
      if (!activeKeys[k] && keyMap[k]) {
        const note = keyMap[k];
        synth.triggerAttack(baseFrequencies[note] * getMultiplier(currentOctave));
        activeKeys[k] = true;
        const el = [...noteGrid.children].find(x => x.dataset.note === note);
        if (el) el.classList.add('active');
      }
    });

    document.addEventListener('keyup', e => {
      const k = e.key;
      if (activeKeys[k] && keyMap[k]) {
        const note = keyMap[k];
        synth.triggerRelease(baseFrequencies[note] * getMultiplier(currentOctave));
        activeKeys[k] = false;
        const el = [...noteGrid.children].find(x => x.dataset.note === note);
        if (el) el.classList.remove('active');
      }
    });
  });
});
