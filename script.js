document.addEventListener("DOMContentLoaded", () => {
    let synth;
    let started = false;
  
    const startBtn = document.getElementById('startButton');
  
    startBtn.addEventListener('click', async () => {
      if (started) return;
  
      await Tone.start();
      synth = new Tone.Synth().toDestination();
      started = true;
  
      // Play a short confirmation note to confirm audio is working
      synth.triggerAttackRelease("C4", "8n");
  
      startBtn.style.display = 'none';
  
      // Add both touch and mouse event listeners
      document.querySelectorAll('.zone').forEach(zone => {
        const playNote = () => {
          const note = zone.getAttribute('data-note');
          synth.triggerAttackRelease(note, "8n");
        };
  
        zone.addEventListener('touchstart', e => {
          e.preventDefault();
          playNote();
        });
  
        zone.addEventListener('click', e => {
          e.preventDefault();
          playNote();
        });
      });
    });
  });
  