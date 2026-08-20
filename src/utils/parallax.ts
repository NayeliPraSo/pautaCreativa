/**
 * Utilidad compartida: parallax de background-image ligado al scroll.
 * El elemento debe tener background-size con margen extra
 * (ej. "auto 130%") para que el desplazamiento tenga hacia dónde moverse.
 */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ParallaxOptions {
  /** Rango total de desplazamiento, en % (ej. 30 = de 35% a 65%) */
  strength?: number;
}

export function initBackgroundParallax(
  element: HTMLElement | null,
  { strength = 30 }: ParallaxOptions = {}
): void {
  if (!element) return;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion) return;

  const from = 50 - strength / 2;
  const to = 50 + strength / 2;

  gsap.fromTo(
    element,
    { backgroundPositionY: `${from}%` },
    {
      backgroundPositionY: `${to}%`,
      ease: "none",
      scrollTrigger: {
        trigger: element,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    }
  );
}