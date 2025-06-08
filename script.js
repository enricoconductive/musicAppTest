let synth;
document.getElementById('startButton').addEventListener('click', async () => {
  await Tone.start();
  synth = new Tone.Synth().toDestination();
  document.getElementById('startButton').style.display = 'none';
});

document.querySelectorAll('.zone').forEach(zone => {
  zone.addEventListener('touchstart', e => {
    if (!synth) return;
    const note = zone.getAttribute('data-note');
    synth.triggerAttackRelease(note, "8n");
  });
});
