document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById('startButton');
  const overlay = document.getElementById('overlay');
  const noteGrid = document.getElementById('noteGrid');
  let synth;
  let activeKeys = {};

  startBtn.addEventListener('click', async () => {
    await Tone.start();
    synth = new Tone.PolySynth(Tone.Synth).toDestination();

    overlay.style.display = 'none';
    noteGrid.style.display = 'flex';

    document.querySelectorAll('.white-key').forEach(key => {
      const note = key.getAttribute('data-note');

      // Mouse/touch start
      key.addEventListener('mousedown', () => {
        synth.triggerAttack(note);
        key.classList.add('active');
      });

      key.addEventListener('mouseup', () => {
        synth.triggerRelease(note);
        key.classList.remove('active');
      });

      key.addEventListener('mouseleave', () => {
        synth.triggerRelease(note);
        key.classList.remove('active');
      });

      key.addEventListener('touchstart', e => {
        e.preventDefault();
        synth.triggerAttack(note);
        key.classList.add('active');
      }, { passive: false });

      key.addEventListener('touchend', e => {
        e.preventDefault();
        synth.triggerRelease(note);
        key.classList.remove('active');
      }, { passive: false });

      key.addEventListener('touchcancel', e => {
        e.preventDefault();
        synth.triggerRelease(note);
        key.classList.remove('active');
      }, { passive: false });
    });

    // Keyboard support
    const keyMap = {
      a: "C4",
      s: "D4",
      d: "E4",
      f: "F4",
      g: "G4",
      ArrowLeft: "C4",
      ArrowUp: "D4",
      ArrowRight: "E4",
      ArrowDown: "F4",
      ' ': "G4"  // Spacebar
    };

    document.addEventListener('keydown', e => {
      const key = e.key;
      if (!activeKeys[key] && keyMap[key]) {
        synth.triggerAttack(keyMap[key]);
        activeKeys[key] = true;
        const keyDiv = [...document.querySelectorAll('.white-key')]
          .find(k => k.getAttribute('data-note') === keyMap[key]);
        if (keyDiv) keyDiv.classList.add('active');
      }
    });

    document.addEventListener('keyup', e => {
      const key = e.key;
      if (activeKeys[key] && keyMap[key]) {
        synth.triggerRelease(keyMap[key]);
        activeKeys[key] = false;
        const keyDiv = [...document.querySelectorAll('.white-key')]
          .find(k => k.getAttribute('data-note') === keyMap[key]);
        if (keyDiv) keyDiv.classList.remove('active');
      }
    });
  });
});
