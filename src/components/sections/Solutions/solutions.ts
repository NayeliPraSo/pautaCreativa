/**
 * Solutions — animaciones y lógica
 * Toda la interacción de esta sección vive aquí.
 */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { solutions, solutionsById } from "./solutions.data";

gsap.registerPlugin(ScrollTrigger);

/* ============================================================
   CONFIG
   ============================================================ */

const MOBILE_QUERY = "(max-width: 768px)";
const SWIPE_THRESHOLD = 50;

/* ============================================================
   ESTADO GLOBAL
   ============================================================ */

let activeSolutionId: string | null = null;

let touchStartX = 0;
let touchStartY = 0;
let isTouchActive = false;

let swipeListenersBound = false;

let resizeTimeout: ReturnType<typeof setTimeout>;

let cleanupCurrentPage: (() => void) | null = null;

let activeDotTween: gsap.core.Tween | null = null;
let activeLabelTween: gsap.core.Tween | null = null;

/* ============================================================
   MÁQUINA DE ESCRIBIR
   ============================================================ */

function splitTextIntoLetters(element: HTMLElement) {
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

      span.classList.add("solutions-letter");
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
}

/* ============================================================
   ANIMACIÓN DE ENTRADA
   ============================================================ */

function initEntryAnimation(
  section: HTMLElement,
  nodes: HTMLElement[],
) {
  const index =
    section.querySelector<HTMLElement>(".solutions-index");

  const intro =
    section.querySelector<HTMLElement>(".solutions-intro");

  const introText =
    section.querySelector<HTMLElement>(".solutions-intro p");

  const plus =
    section.querySelector<HTMLElement>(".solutions-plus");

  const diagramCircle =
    section.querySelector<HTMLElement>(
      ".solutions-diagram-circle",
    );

  const diagramTitle =
    section.querySelector<HTMLElement>(
      ".solutions-diagram-title",
    );

  const nodeDots = Array.from(
    section.querySelectorAll<HTMLElement>(".solution-dot"),
  );

  const nodeLabels = Array.from(
    section.querySelectorAll<HTMLElement>(".solution-label"),
  );

  const scroll =
    section.querySelector<HTMLElement>(".solutions-scroll");

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (prefersReducedMotion) return;

  ScrollTrigger
    .getById("solutions-entry-animation")
    ?.kill();

  gsap.killTweensOf([
    index,
    intro,
    plus,
    diagramCircle,
    diagramTitle,
    ...nodes,
    ...nodeDots,
    ...nodeLabels,
    scroll,
  ]);

  /* =========================================
     PREPARAR TEXTO
     ========================================= */

  let introLetters: HTMLElement[] = [];

  if (introText) {
    if (introText.dataset.split === "true") {
      introLetters = Array.from(
        introText.querySelectorAll<HTMLElement>(
          ".solutions-letter",
        ),
      );
    } else {
      introLetters =
        splitTextIntoLetters(introText);

      introText.dataset.split = "true";
    }
  }

  /* =========================================
     ESTADO INICIAL
     ========================================= */

  if (index) {
    gsap.set(index, {
      opacity: 0,
      y: 15,
    });
  }

  if (intro) {
    gsap.set(intro, {
      opacity: 1,
    });
  }

  gsap.set(introLetters, {
    opacity: 0,
  });

  if (diagramCircle) {
    gsap.set(diagramCircle, {
      opacity: 0,
      scale: 0.88,
      transformOrigin: "center center",
    });
  }

  if (diagramTitle) {
    gsap.set(diagramTitle, {
      opacity: 0,
      scale: 0.75,
      transformOrigin: "center center",
    });
  }

  gsap.set(nodeDots, {
    opacity: 0,
    scale: 0,
    transformOrigin: "center center",
  });

  gsap.set(nodeLabels, {
    opacity: 0,
    y: 8,
  });

  if (scroll) {
    gsap.set(scroll, {
      opacity: 0,
      y: 10,
    });
  }

  /* =========================================
     TIMELINE
     ========================================= */

  const timeline = gsap.timeline({
    scrollTrigger: {
      id: "solutions-entry-animation",
      trigger: section,
      start: "top 68%",
      once: true,
    },
  });

  if (index) {
    timeline.to(index, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: "power2.out",
    });
  }

  if (introLetters.length > 0) {
    timeline.to(
      introLetters,
      {
        opacity: 1,
        duration: 0.01,
        stagger: 0.025,
        ease: "none",
      },
      "-=0.15",
    );
  }

  if (diagramCircle) {
    timeline.to(
      diagramCircle,
      {
        opacity: 1,
        scale: 1,
        duration: 1.15,
        ease: "power3.out",
        clearProps: "opacity,scale",
      },
      "-=0.35",
    );
  }

  if (diagramTitle) {
    timeline.to(
      diagramTitle,
      {
        opacity: 1,
        scale: 1,
        duration: 0.65,
        ease: "back.out(1.5)",
        clearProps: "opacity,scale",
      },
      "-=0.5",
    );
  }

  timeline.to(
    nodeDots,
    {
      opacity: 1,
      scale: 1,
      duration: 0.4,
      stagger: 0.08,
      ease: "back.out(1.8)",
      clearProps: "opacity,scale",
    },
    "-=0.2",
  );

  timeline.to(
    nodeLabels,
    {
      opacity: 1,
      y: 0,
      duration: 0.4,
      stagger: 0.08,
      ease: "power2.out",
      clearProps: "opacity,transform",
    },
    "-=0.45",
  );

  if (scroll) {
    timeline.to(
      scroll,
      {
        opacity: 1,
        y: 0,
        duration: 0.45,
        ease: "power2.out",
      },
      "-=0.1",
    );
  }

  if (plus) {
    timeline.call(() => {
      gsap.killTweensOf(plus);

      gsap.to(plus, {
        scale: 1.35,
        y: -5,
        duration: 0.9,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        transformOrigin: "50% 50%",
      });
    });
  }
}

/* ============================================================
   HOVER DEL PLUS
   ============================================================ */

function initPlusHover(section: HTMLElement) {
  const plus =
    section.querySelector<HTMLElement>(".solutions-plus");

  if (!plus) return () => {};

  const onMouseEnter = () => {
    gsap.to(plus, {
      rotation: "+=180",
      duration: 0.45,
      ease: "back.out(1.7)",
      overwrite: "auto",
    });
  };

  plus.addEventListener(
    "mouseenter",
    onMouseEnter,
  );

  return () => {
    plus.removeEventListener(
      "mouseenter",
      onMouseEnter,
    );
  };
}

/* ============================================================
   DIAGRAMA — RESPIRACIÓN AMBIENTAL
   ============================================================ */

function initDiagramBreathing(
  section: HTMLElement,
) {
  const circle =
    section.querySelector<HTMLElement>(
      ".solutions-diagram-circle",
    );

  const title =
    section.querySelector<HTMLElement>(
      ".solutions-diagram-title",
    );

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const tweens: gsap.core.Tween[] = [];

  if (!prefersReducedMotion) {
    if (circle) {
      tweens.push(
        gsap.to(circle, {
          scale: 1.008,
          duration: 2.8,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          transformOrigin: "center center",
        }),
      );
    }

    if (title) {
      tweens.push(
        gsap.to(title, {
          scale: 1.025,
          duration: 2.8,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          transformOrigin: "center center",
        }),
      );
    }
  }

  return {
    play() {
      tweens.forEach((tween) => {
        tween.play();
      });
    },

    pause() {
      tweens.forEach((tween) => {
        tween.pause();
      });
    },

    kill() {
      tweens.forEach((tween) => {
        tween.kill();
      });

      if (circle) {
        gsap.set(circle, {
          clearProps: "transform",
        });
      }

      if (title) {
        gsap.set(title, {
          clearProps: "transform",
        });
      }
    },
  };
}

/* ============================================================
   NARANJA ACTIVA — RESPIRACIÓN
   ============================================================ */

function initOrangeBreathing(
  section: HTMLElement,
) {
  const orange =
    section.querySelector<HTMLElement>(
      ".solutions-diagram-orange",
    );

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (!orange) {
    return {
      play() {},
      pause() {},
      kill() {},
    };
  }

  const tween = gsap.to(orange, {
    scale: 1.012,
    duration: 2.6,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true,
    paused: true,
    transformOrigin: "center center",
  });

  return {
    play() {
      if (!prefersReducedMotion) {
        tween.play();
      }
    },

    pause() {
      tween.pause(0);

      gsap.set(orange, {
        clearProps: "transform",
      });
    },

    kill() {
      tween.kill();

      gsap.set(orange, {
        clearProps: "transform",
      });
    },
  };
}

/* ============================================================
   NODO ACTIVO — DOT + LABEL
   ============================================================ */

function animateSelectedNode(
  section: HTMLElement,
  id: string,
) {
  activeDotTween?.kill();
  activeLabelTween?.kill();

  activeDotTween = null;
  activeLabelTween = null;

  const node =
    section.querySelector<HTMLElement>(
      `[data-solution="${id}"]`,
    );

  const dot =
    node?.querySelector<HTMLElement>(
      ".solution-dot",
    );

  const label =
    node?.querySelector<HTMLElement>(
      ".solution-label",
    );

  if (!dot || !label) return;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (prefersReducedMotion) return;

  /*
   * Quitamos transform inline previo para que
   * la nueva animación empiece limpia.
   */
  gsap.set([dot, label], {
    clearProps: "transform",
  });

  /* =========================================
     DOT ACTIVO
     ========================================= */

  activeDotTween = gsap.fromTo(
    dot,
    {
      scale: 1.45,
    },
    {
      scale: 1.58,
      duration: 0.85,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      transformOrigin: "center center",
    },
  );

  /* =========================================
     LABEL ACTIVO
     ========================================= */

  activeLabelTween = gsap.fromTo(
    label,
    {
      scale: 1,
    },
    {
      scale: 1.04,
      duration: 0.85,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      transformOrigin: "center center",
    },
  );
}

/* ============================================================
   DETENER ANIMACIÓN DEL NODO ACTIVO
   ============================================================ */

function stopSelectedNodeAnimation(
  section: HTMLElement,
) {
  activeDotTween?.kill();
  activeLabelTween?.kill();

  activeDotTween = null;
  activeLabelTween = null;

  section
    .querySelectorAll<HTMLElement>(
      ".solution-dot, .solution-label",
    )
    .forEach((element) => {
      gsap.set(element, {
        clearProps: "transform",
      });
    });
}

/* ============================================================
   NODOS — INVITACIÓN A INTERACTUAR
   ============================================================ */

function initNodeAttention(
  nodes: HTMLElement[],
) {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const timeline = gsap.timeline({
    repeat: -1,
    repeatDelay: 1.5,
    paused: true,
  });

  if (!prefersReducedMotion) {
    nodes.forEach((node) => {
      const dot =
        node.querySelector<HTMLElement>(
          ".solution-dot",
        );

      const label =
        node.querySelector<HTMLElement>(
          ".solution-label",
        );

      if (!dot || !label) return;

      timeline
        .to(dot, {
          scale: 1.35,
          duration: 0.25,
          ease: "power2.out",
        })

        .to(dot, {
          scale: 1,
          duration: 0.4,
          ease: "back.out(1.7)",
        })

        .to(
          label,
          {
            x: 4,
            duration: 0.25,
            ease: "power2.out",
          },
          "<",
        )

        .to(
          label,
          {
            x: 0,
            duration: 0.35,
            ease: "power2.out",
          },
          "<0.15",
        )

        .to({}, {
          duration: 0.12,
        });
    });
  }

  return {
    play() {
      if (!prefersReducedMotion) {
        timeline.restart();
      }
    },

    pause() {
      timeline.pause(0);

      nodes.forEach((node) => {
        const dot =
          node.querySelector<HTMLElement>(
            ".solution-dot",
          );

        const label =
          node.querySelector<HTMLElement>(
            ".solution-label",
          );

        if (dot) {
          gsap.killTweensOf(dot);

          gsap.set(dot, {
            clearProps: "transform",
          });
        }

        if (label) {
          gsap.killTweensOf(label);

          gsap.set(label, {
            clearProps: "transform",
          });
        }
      });
    },

    kill() {
      timeline.kill();

      nodes.forEach((node) => {
        const dot =
          node.querySelector<HTMLElement>(
            ".solution-dot",
          );

        const label =
          node.querySelector<HTMLElement>(
            ".solution-label",
          );

        if (dot) {
          gsap.set(dot, {
            clearProps: "transform",
          });
        }

        if (label) {
          gsap.set(label, {
            clearProps: "transform",
          });
        }
      });
    },
  };
}

/* ============================================================
   ANIMACIÓN DE CARD
   ============================================================ */

function animateSolutionCard(
  section: HTMLElement,
) {
  const cardContent =
    section.querySelector<HTMLElement>(
      ".solution-card-content",
    );

  const icon =
    section.querySelector<HTMLImageElement>(
      "#solution-icon",
    );

  const title =
    section.querySelector<HTMLElement>(
      "#solution-title",
    );

  const subtitle =
    section.querySelector<HTMLElement>(
      "#solution-subtitle",
    );

  const description =
    section.querySelector<HTMLElement>(
      "#solution-description",
    );

  if (!cardContent) return;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (prefersReducedMotion) return;

  gsap.killTweensOf([
    cardContent,
    icon,
    title,
    subtitle,
    description,
  ]);

  const timeline = gsap.timeline();

  timeline.fromTo(
    cardContent,
    {
      opacity: 0,
      y: 15,
    },
    {
      opacity: 1,
      y: 0,
      duration: 0.45,
      ease: "power2.out",
    },
  );

  if (icon) {
    timeline.fromTo(
      icon,
      {
        opacity: 0,
        scale: 0.65,
      },
      {
        opacity: 1,
        scale: 1,
        duration: 0.45,
        ease: "back.out(1.7)",
      },
      "-=0.3",
    );
  }

  const textElements = [
    title,
    subtitle,
    description,
  ].filter(
    (element): element is HTMLElement =>
      element !== null,
  );

  if (textElements.length > 0) {
    timeline.fromTo(
      textElements,
      {
        opacity: 0,
        y: 10,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.4,
        stagger: 0.07,
        ease: "power2.out",
      },
      "-=0.25",
    );
  }
}

/* ============================================================
   ANIMACIÓN DE VISTA ACTIVA
   ============================================================ */

function animateActiveView(
  section: HTMLElement,
) {
  const background =
    section.querySelector<HTMLElement>(
      "[data-solutions-background]",
    );

  const orange =
    section.querySelector<HTMLElement>(
      ".solutions-diagram-orange",
    );

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (prefersReducedMotion) return;

  if (background) {
    gsap.fromTo(
      background,
      {
        opacity: 0,
      },
      {
        opacity: 1,
        duration: 0.65,
        ease: "power2.out",
        overwrite: "auto",
      },
    );
  }

  if (orange) {
    gsap.fromTo(
      orange,
      {
        opacity: 0,
        scale: 0.92,
      },
      {
        opacity: 1,
        scale: 1,
        duration: 0.7,
        ease: "power3.out",
        overwrite: "auto",
      },
    );
  }
}

/* ============================================================
   INIT
   ============================================================ */

function initSolutions() {
  cleanupCurrentPage?.();
  cleanupCurrentPage = null;

  /* =========================================
     ELEMENTOS OBLIGATORIOS
     ========================================= */

  const sectionElement =
    document.querySelector<HTMLElement>(
      "#soluciones",
    );

  if (!sectionElement) return;

  const section: HTMLElement =
    sectionElement;

  const diagramElement =
    section.querySelector<HTMLElement>(
      ".solutions-diagram",
    );

  if (!diagramElement) return;

  const diagram: HTMLElement =
    diagramElement;

  /* =========================================
     ELEMENTOS
     ========================================= */

  const background =
    section.querySelector<HTMLElement>(
      "[data-solutions-background]",
    );

  const title =
    section.querySelector<HTMLElement>(
      "#solution-title",
    );

  const subtitle =
    section.querySelector<HTMLElement>(
      "#solution-subtitle",
    );

  const description =
    section.querySelector<HTMLElement>(
      "#solution-description",
    );

  const icon =
    section.querySelector<HTMLImageElement>(
      "#solution-icon",
    );

  const nodes = Array.from(
    section.querySelectorAll<HTMLElement>(
      "[data-solution]",
    ),
  );

  const dots = Array.from(
    section.querySelectorAll<HTMLButtonElement>(
      "[data-dot]",
    ),
  );

  activeSolutionId = null;

  /* =========================================
     ANIMACIONES AMBIENTALES
     ========================================= */

  const nodeAttention =
    initNodeAttention(nodes);

  const diagramBreathing =
    initDiagramBreathing(section);

  const orangeBreathing =
    initOrangeBreathing(section);

  /*
   * El diagrama respira en la vista inicial.
   */
  diagramBreathing.play();

  let attentionDelay:
    gsap.core.Tween | null = null;

  /* ============================================================
     MOSTRAR SOLUCIÓN
     ============================================================ */

  function showSolution(id: string) {
    const solution =
      solutionsById[id];

    if (!solution) return;

    activeSolutionId = id;

    /*
     * Detenemos animaciones de la
     * vista general.
     */
    nodeAttention.pause();
    diagramBreathing.pause();

    /*
     * Eliminamos el pulso del nodo anterior.
     */
    stopSelectedNodeAnimation(section);

    /* =========================================
       ACTUALIZAR DATOS
       ========================================= */

    if (background) {
      background.style.backgroundImage =
        `url("${solution.background.src}")`;
    }

    if (title) {
      title.textContent =
        solution.title;
    }

    if (subtitle) {
      subtitle.textContent =
        solution.subtitle;
    }

    if (description) {
      description.textContent =
        solution.description;
    }

    if (icon) {
      icon.src =
        solution.icon.src;

      icon.alt =
        `${solution.title} ${solution.subtitle}`.trim();
    }

    /* =========================================
       ESTADO ACTIVO
       ========================================= */

    section.classList.add(
      "is-active",
    );

    diagram.classList.add(
      "is-active",
    );

    nodes.forEach((node) => {
      node.classList.toggle(
        "is-selected",
        node.dataset.solution === id,
      );
    });

    dots.forEach((dot) => {
      dot.classList.toggle(
        "is-active",
        dot.dataset.dot === id,
      );
    });

    /*
     * En segunda vista respira la naranja.
     */
    orangeBreathing.play();

    /*
     * Esperamos un frame para que las clases
     * CSS ya estén aplicadas.
     */
    requestAnimationFrame(() => {
      animateActiveView(section);
      animateSolutionCard(section);

      /*
       * Dot + label seleccionados pulsan juntos.
       */
      animateSelectedNode(
        section,
        id,
      );
    });
  }

  /* ============================================================
     REGRESAR AL DIAGRAMA
     ============================================================ */

  function hideSolution() {
    activeSolutionId = null;

    const cardContent =
      section.querySelector<HTMLElement>(
        ".solution-card-content",
      );

    if (cardContent) {
      gsap.killTweensOf(
        cardContent,
      );
    }

    /*
     * Detener movimiento del elemento activo.
     */
    stopSelectedNodeAnimation(
      section,
    );

    /*
     * Detener naranja.
     */
    orangeBreathing.pause();

    /* =========================================
       QUITAR ESTADO ACTIVO
       ========================================= */

    section.classList.remove(
      "is-active",
    );

    diagram.classList.remove(
      "is-active",
    );

    /* =========================================
       LIMPIAR DATOS
       ========================================= */

    if (background) {
      background.style.backgroundImage =
        "";
    }

    if (title) {
      title.textContent = "";
    }

    if (subtitle) {
      subtitle.textContent = "";
    }

    if (description) {
      description.textContent = "";
    }

    if (icon) {
      icon.src = "";
      icon.alt = "";
    }

    nodes.forEach((node) => {
      node.classList.remove(
        "is-selected",
      );
    });

    dots.forEach((dot) => {
      dot.classList.toggle(
        "is-active",
        dot.dataset.dot === "",
      );
    });

    /*
     * Recuperamos animaciones de
     * la vista general.
     */
    diagramBreathing.play();
    nodeAttention.play();
  }

  /* ============================================================
     CLICK — NODOS
     ============================================================ */

  const nodeHandlers = new Map<
    HTMLElement,
    () => void
  >();

  nodes.forEach((node) => {
    const handler = () => {
      const id =
        node.dataset.solution;

      if (!id) return;

      /*
       * Click en el mismo nodo activo:
       * regresar al diagrama.
       */
      if (
        activeSolutionId === id
      ) {
        hideSolution();
        return;
      }

      showSolution(id);
    };

    node.addEventListener(
      "click",
      handler,
    );

    nodeHandlers.set(
      node,
      handler,
    );
  });

  /* ============================================================
     CLICK — DOTS INFERIORES
     ============================================================ */

  const dotHandlers = new Map<
    HTMLButtonElement,
    () => void
  >();

  dots.forEach((dot) => {
    const handler = () => {
      const id =
        dot.dataset.dot;

      /*
       * Primer dot =
       * vista del diagrama.
       */
      if (!id) {
        hideSolution();
        return;
      }

      showSolution(id);
    };

    dot.addEventListener(
      "click",
      handler,
    );

    dotHandlers.set(
      dot,
      handler,
    );
  });

  /* ============================================================
     MOBILE — SWIPE
     ============================================================ */

  function getCurrentIndex(): number {
    if (!activeSolutionId) {
      return 0;
    }

    const solutionIndex =
      solutions.findIndex(
        (solution) =>
          solution.id ===
          activeSolutionId,
      );

    return solutionIndex === -1
      ? 0
      : solutionIndex + 1;
  }

  function goToRelativeSolution(
    step: 1 | -1,
  ) {
    const totalSlides =
      solutions.length + 1;

    const currentIndex =
      getCurrentIndex();

    const nextIndex =
      (
        currentIndex +
        step +
        totalSlides
      ) %
      totalSlides;

    if (nextIndex === 0) {
      hideSolution();
      return;
    }

    const nextSolution =
      solutions[nextIndex - 1];

    if (nextSolution) {
      showSolution(
        nextSolution.id,
      );
    }
  }

  function onTouchStart(
    event: TouchEvent,
  ) {
    if (
      event.touches.length !== 1
    ) {
      return;
    }

    touchStartX =
      event.touches[0].clientX;

    touchStartY =
      event.touches[0].clientY;

    isTouchActive = true;
  }

  function onTouchEnd(
    event: TouchEvent,
  ) {
    if (!isTouchActive) {
      return;
    }

    isTouchActive = false;

    const touch =
      event.changedTouches[0];

    const deltaX =
      touch.clientX -
      touchStartX;

    const deltaY =
      touch.clientY -
      touchStartY;

    /*
     * Movimiento principalmente vertical:
     * permitir scroll.
     */
    if (
      Math.abs(deltaX) <
      Math.abs(deltaY)
    ) {
      return;
    }

    /*
     * Gesto demasiado pequeño.
     */
    if (
      Math.abs(deltaX) <
      SWIPE_THRESHOLD
    ) {
      return;
    }

    goToRelativeSolution(
      deltaX < 0 ? 1 : -1,
    );
  }

  /* ============================================================
     BIND / UNBIND SWIPE
     ============================================================ */

  function bindSwipeListeners() {
    if (swipeListenersBound) {
      return;
    }

    diagram.addEventListener(
      "touchstart",
      onTouchStart,
      {
        passive: true,
      },
    );

    diagram.addEventListener(
      "touchend",
      onTouchEnd,
    );

    swipeListenersBound = true;
  }

  function unbindSwipeListeners() {
    if (!swipeListenersBound) {
      return;
    }

    diagram.removeEventListener(
      "touchstart",
      onTouchStart,
    );

    diagram.removeEventListener(
      "touchend",
      onTouchEnd,
    );

    swipeListenersBound = false;
  }

  function syncSwipeListeners() {
    const isMobile =
      window
        .matchMedia(
          MOBILE_QUERY,
        )
        .matches;

    if (isMobile) {
      bindSwipeListeners();
    } else {
      unbindSwipeListeners();
    }
  }

  /* ============================================================
     RESIZE
     ============================================================ */

  const onResize = () => {
    clearTimeout(
      resizeTimeout,
    );

    resizeTimeout =
      setTimeout(
        syncSwipeListeners,
        200,
      );
  };

  window.addEventListener(
    "resize",
    onResize,
  );

  syncSwipeListeners();

  /* ============================================================
     ANIMACIÓN INICIAL
     ============================================================ */

  initEntryAnimation(
    section,
    nodes,
  );

  const removePlusHover =
    initPlusHover(
      section,
    );

  /*
   * Después de la animación inicial,
   * empezamos la llamada de atención
   * secuencial de los nodos.
   */
  attentionDelay =
    gsap.delayedCall(
      4,
      () => {
        if (
          !activeSolutionId
        ) {
          nodeAttention.play();
        }
      },
    );

  /* ============================================================
     CLEANUP
     ============================================================ */

  cleanupCurrentPage = () => {
    ScrollTrigger
      .getById(
        "solutions-entry-animation",
      )
      ?.kill();

    attentionDelay?.kill();

    removePlusHover();

    nodeAttention.kill();

    diagramBreathing.kill();

    orangeBreathing.kill();

    stopSelectedNodeAnimation(
      section,
    );

    nodeHandlers.forEach(
      (
        handler,
        node,
      ) => {
        node.removeEventListener(
          "click",
          handler,
        );
      },
    );

    dotHandlers.forEach(
      (
        handler,
        dot,
      ) => {
        dot.removeEventListener(
          "click",
          handler,
        );
      },
    );

    unbindSwipeListeners();

    window.removeEventListener(
      "resize",
      onResize,
    );

    clearTimeout(
      resizeTimeout,
    );
  };
}

/* ============================================================
   PRIMERA CARGA
   ============================================================ */

initSolutions();

/* ============================================================
   ASTRO VIEW TRANSITIONS
   ============================================================ */

document.addEventListener(
  "astro:page-load",
  initSolutions,
);

export {};