document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener('touchstart', () => {
        Tone.start();
      }, { once: true });      
    const startBtn = document.getElementById('startButton');
    const noteGrid = document.getElementById('noteGrid');
    let synth;
    let activeKeys = {};
  
    const keyMap = {
      a: "C4",
      s: "D4",
      d: "E4",
      f: "F4"
    };
  
    const noteToElement = {};
  
    // ✅ Add this fallback listener for iPad
    document.body.addEventListener('touchstart', () => {
      Tone.start();
    }, { once: true });
  
    startBtn.addEventListener('click', async () => {
      try {
        await Tone.start();
        console.log("Tone.js started via button tap");
        synth = new Tone.PolySynth(Tone.Synth).toDestination();
        console.log('Audio context started');
  
        startBtn.style.display = 'none';
        noteGrid.style.display = 'grid';
      } catch (e) {
        alert("Audio could not be started. Please try tapping again.");
        console.error(e);
      }
            
      document.querySelectorAll('.square').forEach(square => {
        const note = square.getAttribute('data-note');
    
        square.addEventListener('touchstart', (e) => {
          e.preventDefault();
          synth.triggerAttack(note);
        });
    
        square.addEventListener('touchend', (e) => {
          e.preventDefault();
          synth.triggerRelease(note);
        });
    
        square.addEventListener('touchcancel', (e) => {
          e.preventDefault();
          synth.triggerRelease(note);
        });
      });
      // Link notes to DOM elements
      document.querySelectorAll('.square').forEach(square => {
        const note = square.getAttribute('data-note');
        noteToElement[note] = square;
  
        // Mouse control
        square.addEventListener('mousedown', () => {
          synth.triggerAttack(note);
          square.classList.add('active');
        });
  
        square.addEventListener('mouseup', () => {
          synth.triggerRelease(note);
          square.classList.remove('active');
        });
  
        square.addEventListener('mouseleave', () => {
          synth.triggerRelease(note);
          square.classList.remove('active');
        });
      });
  
      // Keyboard control
      document.addEventListener('keydown', (e) => {
        const key = e.key.toLowerCase();
        const note = keyMap[key];
        if (note && !activeKeys[key]) {
          synth.triggerAttack(note);
          noteToElement[note]?.classList.add('active');
          activeKeys[key] = true;
        }
      });
  
      document.addEventListener('keyup', (e) => {
        const key = e.key.toLowerCase();
        const note = keyMap[key];
        if (note && activeKeys[key]) {
          synth.triggerRelease(note);
          noteToElement[note]?.classList.remove('active');
          activeKeys[key] = false;
        }
      });
    });
  });
  