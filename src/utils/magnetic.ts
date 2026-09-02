/**
 * Magnetic hover — utilidad reutilizable
 *
 * Aplica un efecto "magnético" a cualquier elemento con la
 * clase `.magnetic`: al mover el mouse encima, el elemento
 * se desplaza levemente hacia el cursor; al salir, regresa
 * a su lugar con un pequeño rebote.
 *
 * USO:
 *   import { initMagneticButtons } from "../../../utils/magnetic";
 *   initMagneticButtons(); // busca .magnetic en todo el documento
 *   // o, con un contenedor específico:
 *   initMagneticButtons(section);
 *
 * - Respeta prefers-reduced-motion.
 * - Solo se activa con mouse real (hover: hover + pointer: fine),
 *   así no interfiere con scroll/tap en touch.
 * - Idempotente: si se llama varias veces (ej. tras un re-render
 *   parcial), no vuelve a enlazar elementos ya enlazados.
 */

import gsap from "gsap";

const STRENGTH = 0.35;
const MAX_OFFSET = 18;
const FOLLOW_DURATION = 0.3;
const RESET_DURATION = 0.6;

function bindMagnetic(el: HTMLElement): void {
  if (el.dataset.magneticBound === "true") {
    return;
  }

  el.dataset.magneticBound = "true";

  const xTo = gsap.quickTo(el, "x", {
    duration: FOLLOW_DURATION,
    ease: "power3.out",
  });

  const yTo = gsap.quickTo(el, "y", {
    duration: FOLLOW_DURATION,
    ease: "power3.out",
  });

  const handleMove = (event: MouseEvent): void => {
    const rect = el.getBoundingClientRect();

    const relX =
      event.clientX - (rect.left + rect.width / 2);

    const relY =
      event.clientY - (rect.top + rect.height / 2);

    const offsetX = gsap.utils.clamp(
      -MAX_OFFSET,
      MAX_OFFSET,
      relX * STRENGTH,
    );

    const offsetY = gsap.utils.clamp(
      -MAX_OFFSET,
      MAX_OFFSET,
      relY * STRENGTH,
    );

    xTo(offsetX);
    yTo(offsetY);
  };

  const handleLeave = (): void => {
    gsap.to(el, {
      x: 0,
      y: 0,
      duration: RESET_DURATION,
      ease: "elastic.out(1, 0.4)",
    });
  };

  el.addEventListener("mousemove", handleMove);
  el.addEventListener("mouseleave", handleLeave);
}

export function initMagneticButtons(
  root: ParentNode = document,
): void {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (prefersReducedMotion) {
    return;
  }

  const supportsHover = window.matchMedia(
    "(hover: hover) and (pointer: fine)",
  ).matches;

  if (!supportsHover) {
    return;
  }

  const targets =
    root.querySelectorAll<HTMLElement>(".magnetic");

  targets.forEach(bindMagnetic);
}