document.addEventListener("DOMContentLoaded", () => {
    let synth;
    let started = false;
  
    const startBtn = document.getElementById('startButton');
  
    startBtn.addEventListener('click', async () => {
      if (started) return;
  
      await Tone.start();
      synth = new Tone.Synth().toDestination();
      started = true;
  
      startBtn.style.display = 'none';
  
      document.querySelectorAll('.zone').forEach(zone => {
        zone.addEventListener('touchstart', e => {
          e.preventDefault();
          const note = zone.getAttribute('data-note');
          synth.triggerAttackRelease(note, "8n");
        });
      });
    });
  });
  