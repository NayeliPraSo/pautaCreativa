/**
 * Clients — animaciones y lógica
 * Toda la interacción/animación de esta sección vive aquí.
 */

function initMarquees() {
  const marquees = document.querySelectorAll<HTMLElement>(".marquee__track");
  if (!marquees.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const track = entry.target as HTMLElement;
        track.classList.toggle("is-out-of-view", !entry.isIntersecting);
      }
    },
    { threshold: 0 },
  );

  marquees.forEach((track) => observer.observe(track));
}

initMarquees();