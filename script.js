document.addEventListener("DOMContentLoaded", () => {
  const startBtn  = document.getElementById('startButton');
  const overlay   = document.getElementById('overlay');
  const noteGrid  = document.getElementById('noteGrid');
  const instrumentSelect = document.getElementById('instrument');
  

  let synth = null;
  let activeKeys = {};
  let currentOctave = 4;


  function createSynth(type) {
  switch (type) {
    case 'guitar':
      return new Tone.PolySynth(Tone.MonoSynth, {
        oscillator: { type: 'square' },
        envelope: { attack: 0.005, decay: 0.2, sustain: 0.2, release: 1.2 }
      }).toDestination();
    case 'harp':
      return new Tone.PolySynth(Tone.FMSynth, {
        modulationIndex: 8,
        envelope: { attack: 0.01, decay: 0.3, sustain: 0.3, release: 0.8 }
      }).toDestination();
    case 'flute':
      return new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'sine' },
        envelope: { attack: 0.15, decay: 0.1, sustain: 0.6, release: 1.5 }
      }).toDestination();
    default: // piano
      return new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'triangle' },
        envelope: { attack: 0.01, decay: 0.3, sustain: 0.5, release: 1.0 }
      }).toDestination();
  }
}

  const octaveDisplay = document.getElementById("octaveDisplay");
const octaveDownBtn = document.getElementById("octaveDown");
const octaveUpBtn = document.getElementById("octaveUp");
const octaveControls = document.getElementById("octaveControls");

octaveDownBtn.addEventListener("click", () => {
  if (currentOctave > 3) {
    currentOctave--;
    updateKeys();
  }
});

octaveUpBtn.addEventListener("click", () => {
  if (currentOctave < 5) {
    currentOctave++;
    updateKeys();
  }
});

function updateKeys() {
  octaveDisplay.textContent = currentOctave;
  document.querySelectorAll(".white-key").forEach((key, i) => {
    const baseNote = ["C", "D", "E", "F", "G", "A"][i];
    key.setAttribute("data-note", `${baseNote}${currentOctave}`);
  });
}



  function bindKeyEvents() {
    const keyMap = {
      a: "C4", s: "D4", d: "E4", f: "F4", g: "G4", h: "A4",
      ArrowLeft: "C4", ArrowUp: "D4", ArrowRight: "E4",
      ArrowDown: "G4", " ": "A4"
    };

    document.addEventListener('keydown', e => {
      const k = e.key;
      if (!activeKeys[k] && keyMap[k]) {
        synth.triggerAttack(keyMap[k]);
        activeKeys[k] = true;
        const div = [...noteGrid.children].find(x => x.dataset.note === keyMap[k]);
        if (div) div.classList.add('active');
      }
    });

    document.addEventListener('keyup', e => {
      const k = e.key;
      if (activeKeys[k] && keyMap[k]) {
        synth.triggerRelease(keyMap[k]);
        activeKeys[k] = false;
        const div = [...noteGrid.children].find(x => x.dataset.note === keyMap[k]);
        if (div) div.classList.remove('active');
      }
    });
  }

  function bindMouseAndTouchEvents() {
    document.querySelectorAll('.white-key').forEach(key => {
      const note = key.dataset.note;
      const press = () => { synth.triggerAttack(note); key.classList.add('active'); };
      const release = () => { synth.triggerRelease(note); key.classList.remove('active'); };

      key.addEventListener('mousedown', press);
      key.addEventListener('mouseup', release);
      key.addEventListener('mouseleave', release);

      key.addEventListener('touchstart', e => {
        e.preventDefault();
        press();
      }, { passive: false });

      key.addEventListener('touchend', e => {
        e.preventDefault();
        release();
      }, { passive: false });

      key.addEventListener('touchcancel', e => {
        e.preventDefault();
        release();
      }, { passive: false });
    });
  }

  instrumentSelect.addEventListener('change', e => {
    if (synth) synth.disconnect();
    synth = createSynth(e.target.value);
  });

  startBtn.addEventListener('click', async () => {
    await Tone.start();
    synth = createSynth(instrumentSelect.value);
    overlay.style.display  = 'none';
    noteGrid.style.display = 'flex';
    document.getElementById('instrumentSelector').style.display = 'block';
    document.getElementById('octaveControls').style.display = 'flex';
    bindKeyEvents();
    bindMouseAndTouchEvents();
  });
});
