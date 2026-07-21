/**
 * Header — comportamiento
 * Encapsula toda la lógica de interacción del header (scroll, estado activo, etc.)
 * No debe contener estilos ni depender de otras secciones.
 */

const header = document.querySelector<HTMLElement>("[data-header]");

if (header) {
  const SCROLL_THRESHOLD = 8;

  const onScroll = () => {
    const isScrolled = window.scrollY > SCROLL_THRESHOLD;
    header.classList.toggle("is-scrolled", isScrolled);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}
