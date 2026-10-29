(() => {
  /* ===== THE CURTAIN: each interlude is drawn over the room before it ====
     Ivan (2026-10-22): make the change between panels feel intentional. The
     room before an interlude holds still for its last screen (sticky, its
     bottom on the window's bottom) while the interlude, lifted above it,
     slides up and covers it like a sheet drawn across; then the page runs
     on. Purely scroll-driven: no animation, it follows the reader exactly and
     reverses on the way back up.

     The sticky offset is the room's own height measured against the window
     (top = window height - room height, never below 0), so a tall room pins
     only its final screen and a short one pins at the top. Re-measured on load and resize. */
  const pairs = [...document.querySelectorAll('.band-interlude')].map(panel => {
    let room = panel.previousElementSibling;
    while (room && room.offsetHeight === 0) room = room.previousElementSibling;
    return room ? { panel, room } : null;
  }).filter(Boolean);
  if (!pairs.length) return;
  const set = () => {
    for (const { room } of pairs) {
      room.style.top = '';
      /* a room shorter than the window pins at the top: pinned by its bottom
         it would sit part-way down the screen with the room above still
         scrolling through the gap over it (Ivan saw the hero's ASCII there) */
      room.style.top = Math.min(0, innerHeight - room.offsetHeight) + 'px';
    }
  };
  pairs.forEach(({ panel, room }) => { room.classList.add('curtain-under'); panel.classList.add('curtain-over'); });
  addEventListener('resize', set);
  addEventListener('load', set);
  set();
})();
