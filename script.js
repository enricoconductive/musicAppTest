const synth = new Tone.Synth().toDestination();

document.querySelectorAll('.zone').forEach(zone => {
  zone.addEventListener('touchstart', async (e) => {
    e.preventDefault();
    await Tone.start(); // Required on iOS
    const note = zone.getAttribute('data-note');
    synth.triggerAttackRelease(note, "8n");
  });
});
