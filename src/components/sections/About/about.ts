/**
 * About — animaciones y lógica
 * Toda la interacción/animación de esta sección vive aquí.
 */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* =========================================
   DATOS DEL CÍRCULO DERECHO
   ========================================= */

const RIGHT_X = 770;
const CENTER_Y = 325;
const RADIUS = 255;

const FINAL_DOT_X = 933.9;
const FINAL_DOT_Y = 520.3;

const START_ANGLE = -90;

const FINAL_ANGLE =
  Math.atan2(
    FINAL_DOT_Y - CENTER_Y,
    FINAL_DOT_X - RIGHT_X,
  ) *
  (180 / Math.PI);

/* =========================================
   ANIMACIÓN ABOUT
   ========================================= */

const initAboutAnimation = () => {
  const section = document.querySelector<HTMLElement>("#somos");

  if (!section) return;

  const intro =
    section.querySelector<HTMLElement>(".about-intro");

  const leftCircle =
    section.querySelector<SVGGElement>(".venn-left");

  const rightCircle =
    section.querySelector<SVGGElement>(".venn-right");

  const overlap =
    section.querySelector<SVGGElement>(".venn-overlap");

  const pointer =
    section.querySelector<SVGGElement>(".venn-pointer");

  const dot =
    section.querySelector<SVGGElement>(".venn-dot");

  const leftContent =
    section.querySelector<HTMLElement>(".circle-content.left");

  const rightContent =
    section.querySelector<HTMLElement>(".circle-content.right");

  if (
    !intro ||
    !leftCircle ||
    !rightCircle ||
    !overlap ||
    !pointer ||
    !dot ||
    !leftContent ||
    !rightContent
  ) {
    return;
  }

  /* =========================================
     ESTADO INICIAL
     ========================================= */

  gsap.set(intro, {
    opacity: 0,
    y: 30,
  });

  gsap.set(leftCircle, {
    x: -350,
    opacity: 0,
  });

  gsap.set(leftContent, {
    x: -350,
    opacity: 0,
  });

  gsap.set(rightCircle, {
    x: 350,
    opacity: 0,
  });

  gsap.set(rightContent, {
    x: 350,
    opacity: 0,
  });

  gsap.set(overlap, {
    scaleX: 0,
    transformOrigin: "center center",
  });

  gsap.set(pointer, {
    opacity: 0,
    y: -25,
  });

  /* =========================================
     POSICIÓN INICIAL DEL PUNTO
     ========================================= */

  const startRadians =
    START_ANGLE * (Math.PI / 180);

  const startX =
    RIGHT_X +
    Math.cos(startRadians) * RADIUS;

  const startY =
    CENTER_Y +
    Math.sin(startRadians) * RADIUS;

  gsap.set(dot, {
    x: startX - FINAL_DOT_X,
    y: startY - FINAL_DOT_Y,
    opacity: 0,
    scale: 0,
    transformOrigin: "center center",
  });

  /* =========================================
     TIMELINE
     ========================================= */

  const timeline = gsap.timeline({
    scrollTrigger: {
      id: "about-diagram-animation",
      trigger: section,
      start: "top 65%",
      once: true,
    },
  });

  timeline.to(intro, {
    opacity: 1,
    y: 0,
    duration: 0.7,
    ease: "power2.out",
  });

  timeline.to(
    [leftCircle, leftContent],
    {
      x: 0,
      opacity: 1,
      duration: 1.25,
      ease: "power3.out",
    },
    "+=0.15",
  );

  timeline.to(
    [rightCircle, rightContent],
    {
      x: 0,
      opacity: 1,
      duration: 1.25,
      ease: "power3.out",
    },
    "<",
  );

  timeline.to(
    [leftCircle, rightCircle],
    {
      scale: 1.018,
      duration: 0.14,
      ease: "power2.out",
      transformOrigin: "center center",
    },
  );

  timeline.to(
    [leftCircle, rightCircle],
    {
      scale: 1,
      duration: 0.22,
      ease: "power2.inOut",
    },
  );

  timeline.to(
    overlap,
    {
      scaleX: 1,
      duration: 0.85,
      ease: "power2.inOut",
    },
    "-=0.05",
  );

  timeline.to(
    pointer,
    {
      opacity: 1,
      y: 0,
      duration: 0.45,
      ease: "power2.out",
    },
    "-=0.1",
  );

  timeline.to(
    dot,
    {
      opacity: 1,
      scale: 1,
      duration: 0.3,
      ease: "back.out(1.7)",
    },
    "-=0.05",
  );

  const dotMotion = {
    angle: START_ANGLE,
  };

  timeline.to(dotMotion, {
    angle: FINAL_ANGLE,

    duration: 1.25,
    ease: "power1.inOut",

    onUpdate: () => {
      const radians =
        dotMotion.angle * (Math.PI / 180);

      const x =
        RIGHT_X +
        Math.cos(radians) * RADIUS;

      const y =
        CENTER_Y +
        Math.sin(radians) * RADIUS;

      gsap.set(dot, {
        x: x - FINAL_DOT_X,
        y: y - FINAL_DOT_Y,
      });
    },

    onComplete: () => {
      gsap.set(dot, {
        x: 0,
        y: 0,
      });
    },
  });
};

/* =========================================
   INIT
   ========================================= */

const init = () => {
  const about = document.querySelector<HTMLElement>("#somos");

  if (!about) return;

  /* Elimina únicamente la animación anterior del diagrama */
  ScrollTrigger.getById("about-diagram-animation")?.kill();

  /* Animación del diagrama */
  initAboutAnimation();
};

/* Primera carga */
init();

/* Astro View Transitions */
document.addEventListener("astro:page-load", init);

export {};