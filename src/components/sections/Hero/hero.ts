/**
 * Hero — animaciones
 * Toda animación del Hero vive aquí. Hero.astro solo importa este archivo.
 * Sin ScrollTrigger: todo corre una sola vez al cargar la página.
 */

import gsap from "gsap";

const hero = document.querySelector<HTMLElement>("#hero");

if (hero) {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const heroBg = hero.querySelector<HTMLElement>(".hero-bg");

  if (!prefersReducedMotion) {
    /* =========================================
       FONDO — Ken Burns (zoom-out sutil)
       Arranca en window "load" para asegurar que
       la imagen ya esté pintada antes de animar.
       ========================================= */

    if (heroBg) {
      window.addEventListener("load", () => {
        gsap.fromTo(
          heroBg,
          { scale: 1.28 },
          { scale: 1, duration: 3.5, ease: "power1.out" }
        );
      });
    }

    /* =========================================
       CONTENIDO — entrada en cascada
       ========================================= */

    const index = hero.querySelector<HTMLElement>(".hero-index");
    const titleSmall = hero.querySelector<HTMLElement>(".hero-title-small");
    const titleMain = hero.querySelector<HTMLElement>(".hero-title-main");
    const subtitle = hero.querySelector<HTMLElement>(".hero-subtitle");
    const plusGroups = hero.querySelectorAll<HTMLElement>(".hero-plus-group");
    const scroll = hero.querySelector<HTMLElement>(".hero-scroll");

    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
    });

    tl.from(index, { opacity: 0, y: 20, duration: 0.6 })
      .from(titleSmall, { opacity: 0, y: 30, duration: 0.7 }, "-=0.35")
      .from(titleMain, { opacity: 0, y: 40, duration: 0.8 }, "-=0.45")
      .from(subtitle, { opacity: 0, y: 24, duration: 0.6 }, "-=0.5")
      .from(
        plusGroups,
        { opacity: 0, y: 16, duration: 0.5, stagger: 0.1 },
        "-=0.35"
      )
      .from(scroll, { opacity: 0, y: 10, duration: 0.5 }, "-=0.2");
  }
}

export {};