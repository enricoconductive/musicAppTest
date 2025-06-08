let synth;
let started = false;

document.getElementById('startButton').addEventListener('click', async () => {
  if (started) return;

  await Tone.start();
  synth = new Tone.Synth().toDestination();
  started = true;

  document.getElementById('startButton').style.display = 'none';

  // Activate touch listeners only after audio is unlocked
  document.querySelectorAll('.zone').forEach(zone => {
    zone.addEventListener('touchstart', e => {
      e.preventDefault();
      const note = zone.getAttribute('data-note');
      synth.triggerAttackRelease(note, "8n");
    });
  });
});
