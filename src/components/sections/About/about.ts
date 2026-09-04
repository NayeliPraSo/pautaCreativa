/**
 * About — animaciones y lógica
 * Toda la interacción/animación de esta sección vive aquí.
 */

import gsap from "gsap";
import { getTypewriterStagger } from "../../../utils/typewriter";

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

const splitTextIntoLetters = (
  element: HTMLElement,
): HTMLSpanElement[] => {
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
    const fragment =
      document.createDocumentFragment();

    [...text].forEach((character) => {
      const span =
        document.createElement("span");

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

const initLetterSpread = (
  element: HTMLElement,
): void => {
  if (
    element.dataset.letterSpread === "true"
  ) {
    return;
  }

  element.dataset.letterSpread = "true";

  const text = element.textContent ?? "";

  element.setAttribute(
    "aria-label",
    text,
  );

  element.textContent = "";

  const letters: HTMLSpanElement[] = [];

  [...text].forEach((character) => {
    const span =
      document.createElement("span");

    span.classList.add(
      "circle-title-letter",
    );

    span.setAttribute(
      "aria-hidden",
      "true",
    );

    span.textContent = character;

    element.appendChild(span);
    letters.push(span);
  });

  letters.forEach((letter, index) => {
    letter.addEventListener(
      "mouseenter",
      () => {
        const previous =
          letters[index - 1];

        const next =
          letters[index + 1];

        gsap.to(letter, {
          x: 0,
          y: -6,
          scale: 1.12,
          duration: 0.3,
          ease: "power2.out",
          overwrite: "auto",
        });

        if (previous) {
          gsap.to(previous, {
            x: -6,
            duration: 0.3,
            ease: "power2.out",
            overwrite: "auto",
          });
        }

        if (next) {
          gsap.to(next, {
            x: 6,
            duration: 0.3,
            ease: "power2.out",
            overwrite: "auto",
          });
        }
      },
    );

    letter.addEventListener(
      "mouseleave",
      () => {
        gsap.to(letters, {
          x: 0,
          y: 0,
          scale: 1,
          duration: 0.4,
          ease: "power2.out",
          overwrite: "auto",
        });
      },
    );
  });
};

/* =========================================
   ANIMACIÓN ABOUT
   ========================================= */

const initAboutAnimation = (): void => {
  const section =
    document.querySelector<HTMLElement>(
      "#somos",
    );

  if (!section) return;

  /* =========================================
     ELEMENTOS
     ========================================= */

  const intro =
    section.querySelector<HTMLElement>(
      ".about-intro",
    );

  const copy =
    section.querySelector<HTMLElement>(
      ".about-copy",
    );

  const leftCircle =
    section.querySelector<SVGGElement>(
      ".venn-left",
    );

  const rightCircle =
    section.querySelector<SVGGElement>(
      ".venn-right",
    );

  const overlap =
    section.querySelector<SVGGElement>(
      ".venn-overlap",
    );

  const pointer =
    section.querySelector<SVGGElement>(
      ".venn-pointer",
    );

  const dot =
    section.querySelector<SVGGElement>(
      ".venn-dot",
    );

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
    section.querySelector<HTMLElement>(
      ".about-plus",
    );

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
     REDUCED MOTION
     ========================================= */

  const prefersReducedMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

  /* =========================================
     TÍTULOS DE LOS CÍRCULOS
     ========================================= */

  const leftTitle =
    leftContent.querySelector<HTMLElement>(
      "h3",
    );

  const rightTitle =
    rightContent.querySelector<HTMLElement>(
      "h3",
    );

  if (leftTitle) {
    initLetterSpread(leftTitle);
  }

  if (rightTitle) {
    initLetterSpread(rightTitle);
  }

  if (prefersReducedMotion) {
    return;
  }

  /* =========================================
     PREPARAR TEXTO INTRO
     ========================================= */

  let letters: HTMLElement[];

  if (copy.dataset.split === "true") {
    letters = Array.from(
      copy.querySelectorAll<HTMLElement>(
        ".about-letter",
      ),
    );
  } else {
    letters =
      splitTextIntoLetters(copy);

    copy.dataset.split = "true";
  }

  /* =========================================
     POSICIÓN INICIAL DEL PUNTO
     ========================================= */

  const startRadians =
    START_ANGLE *
    (Math.PI / 180);

  const startX =
    RIGHT_X +
    Math.cos(startRadians) *
      RADIUS;

  const startY =
    CENTER_Y +
    Math.sin(startRadians) *
      RADIUS;

  /* =========================================
     MOVIMIENTO DEL PUNTO
     ========================================= */

  const dotMotion = {
    angle: START_ANGLE,
  };

  const updateDotPosition = (): void => {
    const radians =
      dotMotion.angle *
      (Math.PI / 180);

    const x =
      RIGHT_X +
      Math.cos(radians) *
        RADIUS;

    const y =
      CENTER_Y +
      Math.sin(radians) *
        RADIUS;

    gsap.set(dotCircle, {
      attr: {
        cx: x,
        cy: y,
      },
    });
  };

  /* =========================================
     ESTADO INICIAL
     ========================================= */

  const setInitialState = (): void => {
    gsap.set(intro, {
      opacity: 1,
    });

    gsap.set(letters, {
      opacity: 0,
    });

    gsap.set(leftCircle, {
      x: -350,
      opacity: 0,
      scale: 1,
      transformOrigin:
        "center center",
    });

    gsap.set(leftContent, {
      x: -350,
      opacity: 0,
    });

    gsap.set(rightCircle, {
      x: 350,
      opacity: 0,
      scale: 1,
      transformOrigin:
        "center center",
    });

    gsap.set(rightContent, {
      x: 350,
      opacity: 0,
    });

    gsap.set(overlap, {
      opacity: 0,
      scale: 1,
      filter: "brightness(0.6)",
      transformOrigin:
        "center center",
    });

    gsap.set(pointer, {
      opacity: 0,
      y: -25,
    });

    gsap.set(dot, {
      opacity: 0,
    });

    dotMotion.angle =
      START_ANGLE;

    gsap.set(dotCircle, {
      attr: {
        cx: startX,
        cy: startY,
      },
    });

    if (plus) {
      gsap.set(plus, {
        opacity: 0,
        scale: 1,
        y: 0,
        transformOrigin:
          "50% 50%",
      });
    }
  };

  setInitialState();

  /* =========================================
     PLUS — HOVER
     ========================================= */

  if (plus) {
    plus.addEventListener(
      "mouseenter",
      () => {
        gsap.to(plus, {
          rotation: "+=180",
          duration: 0.45,
          ease: "back.out(1.7)",
        });
      },
    );
  }

  /* =========================================
     ANIMACIONES AMBIENTALES
     ========================================= */

  /* PLUS */

  const plusPulse =
    plus
      ? gsap.fromTo(
          plus,
          {
            scale: 1,
            y: 0,
          },
          {
            scale: 1.5,
            y: -8,
            duration: 0.8,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            paused: true,
            immediateRender: false,
          },
        )
      : null;

  /* RESPIRACIÓN DEL DIAGRAMA */

  const diagramBreathing =
    gsap.fromTo(
      [
        leftCircle,
        rightCircle,
        overlap,
      ],
      {
        scale: 1,
      },
      {
        scale: 1.008,
        duration: 2.2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        paused: true,
        transformOrigin:
          "center center",
        immediateRender: false,
      },
    );

  /* MOVIMIENTO CONTINUO DE LA FLECHA */

  const pointerFloat =
    gsap.fromTo(
      pointer,
      {
        y: 0,
      },
      {
        y: 10,
        duration: 0.9,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        paused: true,
        immediateRender: false,
      },
    );

  /* =========================================
     TIMELINE DE ENTRADA
     ========================================= */

  const entranceTl =
    gsap.timeline({
      paused: true,

      defaults: {
        ease: "power3.out",
      },
    });

  /* =========================================
     INTRO — MÁQUINA DE ESCRIBIR
     ========================================= */

  entranceTl.to(letters, {
    opacity: 1,
    duration: 0.01,

    stagger: {
      each: getTypewriterStagger(letters.length),
      from: "start",
    },

    ease: "none",
  });

  /* =========================================
     PLUS
     ========================================= */

  if (plus) {
    entranceTl.to(
      plus,
      {
        opacity: 1,
        duration: 0.35,
        ease: "power2.out",
      },
      "-=0.2",
    );

    entranceTl.call(() => {
      plusPulse?.restart();
    });
  }

  /* =========================================
     CÍRCULOS
     ========================================= */

  entranceTl.to(
    [
      leftCircle,
      leftContent,
    ],
    {
      x: 0,
      opacity: 1,
      duration: 1.25,
      ease: "power3.out",
    },
    "+=0.15",
  );

  entranceTl.to(
    [
      rightCircle,
      rightContent,
    ],
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

  entranceTl.to(
    [
      leftCircle,
      rightCircle,
    ],
    {
      scale: 1.018,
      duration: 0.14,
      ease: "power2.out",
      transformOrigin:
        "center center",
    },
  );

  entranceTl.to(
    [
      leftCircle,
      rightCircle,
    ],
    {
      scale: 1,
      duration: 0.22,
      ease: "power2.inOut",
    },
  );

  /* =========================================
     INTERSECCIÓN
     ========================================= */

  entranceTl.to(
    overlap,
    {
      opacity: 1,
      filter: "brightness(1)",
      duration: 1.6,
      ease: "power2.inOut",
    },
    "-=0.45",
  );

  entranceTl.call(() => {
    diagramBreathing.restart();
  });

  /* =========================================
     FLECHA
     ========================================= */

  entranceTl.to(
    pointer,
    {
      opacity: 1,
      y: 0,
      duration: 0.45,
      ease: "power2.out",
    },
    "-=0.1",
  );

  entranceTl.call(() => {
    pointerFloat.restart();
  });

  /* =========================================
     PUNTO
     ========================================= */

  entranceTl.to(
    dot,
    {
      opacity: 1,
      duration: 0.35,
      ease: "power2.out",
    },
    "-=0.05",
  );

  entranceTl.to(
    dotMotion,
    {
      angle: FINAL_ANGLE,
      duration: 1.25,
      ease: "power1.inOut",

      onUpdate: () => {
        updateDotPosition();
      },
    },
  );

  /* =========================================
     ESTADO DE REPLAY
     ========================================= */

  let hasPlayed = false;
  let isArmedForReplay = true;

  /* =========================================
     PLAY
     ========================================= */

  const playAbout = (): void => {
    if (!isArmedForReplay) {
      return;
    }

    isArmedForReplay = false;
    hasPlayed = true;

    /*
     * Solo pausamos los loops.
     * No destruimos ningún tween.
     */
    plusPulse?.pause();

    diagramBreathing.pause();

    pointerFloat.pause();

    /*
     * Punto siempre desde arriba.
     */
    dotMotion.angle =
      START_ANGLE;

    updateDotPosition();

    /*
     * Timeline intacta.
     */
    entranceTl.restart();
  };

  /* =========================================
     RESET
     ========================================= */

  const resetAbout = (): void => {
    if (!hasPlayed) return;
    if (isArmedForReplay) return;

    isArmedForReplay = true;
    hasPlayed = false;

    /*
     * Detenemos ambientales.
     */
    plusPulse?.pause();

    diagramBreathing.pause();

    pointerFloat.pause();

    /*
     * Regresamos la timeline al inicio.
     * NO usamos killTweensOf().
     */
    entranceTl.pause(0);

    /*
     * Estado visual inicial.
     */
    setInitialState();
  };

  /* =========================================
     DETECCIÓN DE VISIBILIDAD
     ========================================= */

  const checkAboutPosition =
    (): void => {
      const rect =
        section.getBoundingClientRect();

      const viewportHeight =
        window.innerHeight;

      /* =====================================
         RESET AL SALIR HACIA ABAJO
         ===================================== */
      const leftThroughTop =
        rect.bottom <=
        viewportHeight * 0.05;

      /* =====================================
         RESET AL SALIR HACIA ARRIBA
         ===================================== */
      const leftThroughBottom =
        rect.top >=
        viewportHeight * 0.95;

      if (
        leftThroughTop ||
        leftThroughBottom
      ) {
        resetAbout();
        return;
      }

      /* =====================================
         ALTURA VISIBLE
         ===================================== */

      const visibleTop =
        Math.max(
          rect.top,
          0,
        );

      const visibleBottom =
        Math.min(
          rect.bottom,
          viewportHeight,
        );

      const visibleHeight =
        Math.max(
          0,
          visibleBottom -
            visibleTop,
        );

      /*
       * No activamos por apenas
       * unos píxeles visibles.
       */
      const minimumVisible =
        Math.min(
          120,
          viewportHeight * 0.12,
        );

      const isVisibleEnough =
        visibleHeight >=
        minimumVisible;

      /* =====================================
         ZONA DE ACTIVACIÓN
         ===================================== */
      const reachedActivationZone =
        rect.top <
          viewportHeight * 0.78 &&
        rect.bottom >
          viewportHeight * 0.05;

      if (
        isVisibleEnough &&
        reachedActivationZone
      ) {
        playAbout();
      }
    };

  /* =========================================
     LISTENERS
     ========================================= */

  window.addEventListener(
    "scroll",
    checkAboutPosition,
    {
      passive: true,
    },
  );

  window.addEventListener(
    "resize",
    checkAboutPosition,
    {
      passive: true,
    },
  );

  /* =========================================
     PRIMERA COMPROBACIÓN
     ========================================= */

  requestAnimationFrame(() => {
    checkAboutPosition();
  });
};

/* =========================================
   INIT
   ========================================= */

initAboutAnimation();

export {};