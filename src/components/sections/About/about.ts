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
   MÁQUINA DE ESCRIBIR
   ========================================= */

const splitTextIntoLetters = (element: HTMLElement) => {
  const letters: HTMLSpanElement[] = [];
  const textNodes: Text[] = [];

  const walker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_TEXT,
  );

  let node: Node | null;

  while ((node = walker.nextNode())) {
    textNodes.push(node as Text);
  }

  textNodes.forEach((textNode) => {
    const text = textNode.textContent ?? "";
    const fragment = document.createDocumentFragment();

    [...text].forEach((character) => {
      const span = document.createElement("span");

      span.classList.add("about-letter");
      span.textContent = character;

      fragment.appendChild(span);
      letters.push(span);
    });

    textNode.parentNode?.replaceChild(
      fragment,
      textNode,
    );
  });

  return letters;
};

/* =========================================
   HOVER — SEPARACIÓN DE LETRAS
   ========================================= */

const initLetterSpread = (element: HTMLElement) => {
  if (element.dataset.letterSpread === "true") return;

  element.dataset.letterSpread = "true";

  const text = element.textContent ?? "";

  element.setAttribute("aria-label", text);
  element.textContent = "";

  const letters: HTMLSpanElement[] = [];

  [...text].forEach((character) => {
    const span = document.createElement("span");

    span.classList.add("circle-title-letter");
    span.setAttribute("aria-hidden", "true");
    span.textContent = character;

    element.appendChild(span);
    letters.push(span);
  });

  letters.forEach((letter, index) => {
    letter.addEventListener("mouseenter", () => {
      const previous = letters[index - 1];
      const next = letters[index + 1];

      /* Letra sobre la que está el mouse */
      gsap.to(letter, {
        x: 0,
        y: -6,
        scale: 1.12,
        duration: 0.3,
        ease: "power2.out",
        overwrite: "auto",
      });

      /* Empuja ligeramente la anterior */
      if (previous) {
        gsap.to(previous, {
          x: -6,
          duration: 0.3,
          ease: "power2.out",
          overwrite: "auto",
        });
      }

      /* Empuja ligeramente la siguiente */
      if (next) {
        gsap.to(next, {
          x: 6,
          duration: 0.3,
          ease: "power2.out",
          overwrite: "auto",
        });
      }
    });

    letter.addEventListener("mouseleave", () => {
      gsap.to(letters, {
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.4,
        ease: "power2.out",
        overwrite: "auto",
      });
    });
  });
};

/* =========================================
   ANIMACIÓN ABOUT
   ========================================= */

const initAboutAnimation = () => {
  const section =
    document.querySelector<HTMLElement>("#somos");

  if (!section) return;

  const intro =
    section.querySelector<HTMLElement>(".about-intro");

  const copy =
    section.querySelector<HTMLElement>(".about-copy");

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

  const dotCircle =
    section.querySelector<SVGCircleElement>(
      ".venn-dot circle",
    );

  const leftContent =
    section.querySelector<HTMLElement>(
      ".circle-content.left",
    );

  const rightContent =
    section.querySelector<HTMLElement>(
      ".circle-content.right",
    );

  const plus =
    section.querySelector<HTMLElement>(".about-plus");

  if (
    !intro ||
    !copy ||
    !leftCircle ||
    !rightCircle ||
    !overlap ||
    !pointer ||
    !dot ||
    !dotCircle ||
    !leftContent ||
    !rightContent
  ) {
    return;
  }

  /* =========================================
     TÍTULOS DE LOS CÍRCULOS
     ========================================= */

  const leftTitle =
    leftContent.querySelector<HTMLElement>("h3");

  const rightTitle =
    rightContent.querySelector<HTMLElement>("h3");

  if (leftTitle) {
    initLetterSpread(leftTitle);
  }

  if (rightTitle) {
    initLetterSpread(rightTitle);
  }

  /* =========================================
     PREPARAR TEXTO INTRO
     ========================================= */

  /*
   * Evita volver a dividir el texto si
   * Astro ejecuta init() más de una vez.
   */
  let letters: HTMLElement[];

  if (copy.dataset.split === "true") {
    letters = Array.from(
      copy.querySelectorAll<HTMLElement>(".about-letter"),
    );
  } else {
    letters = splitTextIntoLetters(copy);
    copy.dataset.split = "true";
  }

  /* =========================================
     ESTADO INICIAL
     ========================================= */

  gsap.set(intro, {
    opacity: 1,
  });

  gsap.set(letters, {
    opacity: 0,
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
    opacity: 0,
    filter: "brightness(0.6)",
  });

  gsap.set(pointer, {
    opacity: 0,
    y: -25,
  });

  if (plus) {
    gsap.set(plus, {
      opacity: 0,
      transformOrigin: "50% 50%",
    });

    plus.addEventListener("mouseenter", () => {
      gsap.to(plus, {
        rotation: "+=180",
        duration: 0.45,
        ease: "back.out(1.7)",
      });
    });
  }

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

  gsap.set(dotCircle, {
    attr: {
      cx: startX,
      cy: startY,
    },
  });

  gsap.set(dot, {
    opacity: 0,
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

  /* =========================================
     INTRO — MÁQUINA DE ESCRIBIR
     ========================================= */

  timeline.to(letters, {
    opacity: 1,
    duration: 0.01,
    stagger: 0.035,
    ease: "none",
  });

  /* =========================================
     PLUS
     ========================================= */

  if (plus) {
    timeline.to(
      plus,
      {
        opacity: 1,
        duration: 0.35,
        ease: "power2.out",
      },
      "-=0.2",
    );

    timeline.call(() => {
      gsap.to(plus, {
        scale: 1.5,
        y: -8,
        duration: 0.8,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    });
  }

  /* =========================================
     CÍRCULOS
     ========================================= */

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

  /* =========================================
     IMPACTO AL ENCONTRARSE
     ========================================= */

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

  /* =========================================
     INTERSECCIÓN
     ========================================= */

  timeline.to(
    overlap,
    {
      opacity: 1,
      filter: "brightness(1)",
      duration: 1.6,
      ease: "power2.inOut",
    },
    "-=0.45",
  );

  /* =========================================
     RESPIRACIÓN DEL DIAGRAMA
     ========================================= */

  timeline.call(() => {
    gsap.to(
      [leftCircle, rightCircle, overlap],
      {
        scale: 1.008,
        duration: 2.2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        transformOrigin: "center center",
      },
    );
  });

  /* =========================================
     FLECHA
     ========================================= */

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

  /* Movimiento continuo de la flecha */
  timeline.call(() => {
    gsap.to(pointer, {
      y: 10,
      duration: 0.9,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });
  });

  /* =========================================
     PUNTO
     ========================================= */

  timeline.to(
    dot,
    {
      opacity: 1,
      duration: 0.35,
      ease: "power2.out",
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

      gsap.set(dotCircle, {
        attr: {
          cx: x,
          cy: y,
        },
      });
    },
  });
};

/* =========================================
   INIT
   ========================================= */

const init = () => {
  const about =
    document.querySelector<HTMLElement>("#somos");

  if (!about) return;

  ScrollTrigger
    .getById("about-diagram-animation")
    ?.kill();

  initAboutAnimation();
};

/* Primera carga */
init();

/* Astro View Transitions */
document.addEventListener(
  "astro:page-load",
  init,
);

export {};