import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const mm = gsap.matchMedia();

const prefersReducedMotion =
  window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

/* ============================================================
   MÁQUINA DE ESCRIBIR
   ============================================================ */

function splitTextIntoLetters(
  element: HTMLElement
): HTMLElement[] {
  const letters: HTMLElement[] = [];
  const textNodes: Text[] = [];

  const walker =
    document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT
    );

  let node: Node | null;

  while ((node = walker.nextNode())) {
    textNodes.push(node as Text);
  }

  textNodes.forEach((textNode) => {
    const text =
      textNode.textContent ?? "";

    const fragment =
      document.createDocumentFragment();

    [...text].forEach((character) => {
      const span =
        document.createElement("span");

      span.classList.add("om-letter");
      span.textContent = character;

      /*
       * Inline mantiene:
       * - saltos naturales
       * - responsive
       * - estilos internos como <strong>
       */
      span.style.display = "inline";

      fragment.appendChild(span);
      letters.push(span);
    });

    textNode.parentNode?.replaceChild(
      fragment,
      textNode
    );
  });

  return letters;
}

/* ============================================================
   OBTENER / CREAR LETRAS
   ============================================================ */

function getTextLetters(
  element: HTMLElement | null
): HTMLElement[] {
  if (!element) return [];

  if (element.dataset.split === "true") {
    return Array.from(
      element.querySelectorAll<HTMLElement>(
        ".om-letter"
      )
    );
  }

  const letters =
    splitTextIntoLetters(element);

  element.dataset.split = "true";

  return letters;
}

/* ============================================================
   TIMELINE — PULSO SECUENCIAL
   ============================================================ */

function createTimelinePulse(
  items: NodeListOf<HTMLElement>
): gsap.core.Timeline | null {
  if (
    prefersReducedMotion ||
    !items.length
  ) {
    return null;
  }

  const timeline =
    gsap.timeline({
      repeat: -1,
      repeatDelay: 0.7,
      paused: true,
    });

  items.forEach((item) => {
    const dot =
      item.querySelector<HTMLElement>(
        ".om-timeline-dot"
      );

    const label =
      item.querySelector<HTMLElement>(
        ".om-timeline-label"
      );

    if (!dot) return;

    /* =========================================
       DOT — CRECE
       ========================================= */

    timeline.to(dot, {
      scale: 1.45,
      opacity: 0.7,

      duration: 0.4,

      ease: "sine.inOut",

      transformOrigin: "50% 50%",
    });

    /* =========================================
       LABEL — ACOMPAÑA
       ========================================= */

    if (label) {
      timeline.to(
        label,
        {
          scale: 1.06,

          duration: 0.4,

          ease: "sine.inOut",

          transformOrigin: "50% 50%",
        },
        "<"
      );
    }

    /* =========================================
       PEQUEÑA PAUSA
       ========================================= */

    timeline.to(
      {},
      {
        duration: 0.25,
      }
    );

    /* =========================================
       DOT — REGRESA
       ========================================= */

    timeline.to(dot, {
      scale: 1,
      opacity: 1,

      duration: 0.45,

      ease: "sine.inOut",
    });

    /* =========================================
       LABEL — REGRESA
       ========================================= */

    if (label) {
      timeline.to(
        label,
        {
          scale: 1,

          duration: 0.45,

          ease: "sine.inOut",
        },
        "<"
      );
    }

    /* =========================================
       PAUSA ANTES DEL SIGUIENTE
       ========================================= */

    timeline.to(
      {},
      {
        duration: 0.15,
      }
    );
  });

  return timeline;
}

/* ============================================================
   ORANGE MINDSET
   ============================================================ */

function initOrangeMindset(): void {
  const section =
    document.querySelector<HTMLElement>(
      "#orange-mindset"
    );

  const slider =
    section?.querySelector<HTMLElement>(
      ".om-slider"
    );

  const bgLayer =
    section?.querySelector<HTMLElement>(
      ".om-bg-peel"
    );

  if (!section || !slider) return;

  /* ==========================================================
     PANEL 1 — REFS
     ========================================================== */

  const p1Index =
    section.querySelector<HTMLElement>(
      ".om-panel-1 .om-index"
    );

  const p1Visual =
    section.querySelector<HTMLElement>(
      ".om-panel-1 .om-visual"
    );

  const p1Fruit =
    section.querySelector<HTMLElement>(
      ".om-visual-fruit"
    );

  const p1OrangeTitle =
    section.querySelector<HTMLElement>(
      ".om-visual-orange-title"
    );

  const p1MindsetTitle =
    section.querySelector<HTMLElement>(
      ".om-visual-mindset-title"
    );

  const p1Vivimos =
    section.querySelector<HTMLElement>(
      ".om-visual-vivimos"
    );

  const p1Copy =
    section.querySelector<HTMLElement>(
      ".om-panel-1 .om-copy"
    );

  const p1Divider =
    section.querySelector<HTMLElement>(
      ".om-panel-1 .om-divider"
    );

  /* ==========================================================
     PANEL 2 — REFS
     ========================================================== */

  const panel2 =
    section.querySelector<HTMLElement>(
      ".om-panel-2"
    );

  const p2Intro =
    section.querySelector<HTMLElement>(
      ".om-intro"
    );

  const p2TimelineItems =
    section.querySelectorAll<HTMLElement>(
      ".om-timeline-item"
    );

  const p2DescriptionWrap =
    section.querySelector<HTMLElement>(
      ".om-description-wrap"
    );

  const p2Description =
    section.querySelector<HTMLElement>(
      ".om-description"
    );

  /* ==========================================================
     PREPARAR LETRAS
     ========================================================== */

  let p1CopyLetters: HTMLElement[] = [];
  let p2IntroLetters: HTMLElement[] = [];
  let p2DescriptionLetters: HTMLElement[] = [];

  if (!prefersReducedMotion) {
    p1CopyLetters =
      getTextLetters(p1Copy);

    p2IntroLetters =
      getTextLetters(p2Intro);

    p2DescriptionLetters =
      getTextLetters(p2Description);
  }

  /* ==========================================================
     PULSO AMBIENTAL DEL PANEL 2
     ========================================================== */

  const timelinePulse =
    createTimelinePulse(
      p2TimelineItems
    );

  /* ==========================================================
     ESTADOS DE REPLAY
     ========================================================== */

  let panelOnePlayed = false;
  let panelTwoPlayed = false;

  let panelOneTimeline:
    gsap.core.Timeline | null = null;

  let panelTwoTimeline:
    gsap.core.Timeline | null = null;

  /* ==========================================================
     PANEL 1 — ESTADO INICIAL
     ========================================================== */

  const setPanelOneInitialState =
    (): void => {
      if (
        !p1Index ||
        !p1Visual ||
        !p1Fruit ||
        !p1OrangeTitle ||
        !p1MindsetTitle ||
        !p1Vivimos ||
        !p1Copy ||
        !p1Divider
      ) {
        return;
      }

      gsap.set(p1Index, {
        opacity: 0,
        y: 20,
      });

      gsap.set(p1Visual, {
        opacity: 1,
      });

      /*
       * IMPORTANTE:
       * Las posiciones finales de estas imágenes viven en CSS.
       * No usamos x, y, scale, rotation ni xPercent aquí porque
       * GSAP escribiría sobre `transform` y podría romper los
       * translateX(-50%) definidos en el stylesheet.
       */

      gsap.set(p1Fruit, {
        autoAlpha: 0,
        clipPath: "inset(0 100% 0 0)",
        filter: "blur(6px)",
      });

      gsap.set(p1OrangeTitle, {
        autoAlpha: 0,
        clipPath: "inset(0 100% 0 0)",
        filter: "blur(3px)",
      });

      gsap.set(p1MindsetTitle, {
        autoAlpha: 0,
        clipPath: "inset(0 0 0 100%)",
        filter: "blur(3px)",
      });

      gsap.set(p1Vivimos, {
        autoAlpha: 0,
        clipPath: "inset(0 100% 0 0)",
        filter: "blur(2px)",
      });

      /*
       * El contenedor permanece visible.
       * Solo las letras desaparecen.
       */

      gsap.set(p1Copy, {
        opacity: 1,
      });

      gsap.set(
        p1CopyLetters,
        {
          opacity: 0,
        }
      );

      gsap.set(p1Divider, {
        scaleX: 0,

        transformOrigin:
          "left center",
      });
    };

  /* ==========================================================
     PANEL 2 — ESTADO INICIAL
     ========================================================== */

  const setPanelTwoInitialState =
    (): void => {
      if (
        !panel2 ||
        !p2Intro ||
        !p2DescriptionWrap ||
        !p2TimelineItems.length
      ) {
        return;
      }

      gsap.set(p2Intro, {
        opacity: 1,
      });

      gsap.set(
        p2IntroLetters,
        {
          opacity: 0,
        }
      );

      gsap.set(
        p2TimelineItems,
        {
          opacity: 0,
          y: 20,
        }
      );

      gsap.set(
        p2DescriptionWrap,
        {
          opacity: 1,
        }
      );

      gsap.set(
        p2DescriptionLetters,
        {
          opacity: 0,
        }
      );

      /*
       * Restauramos también el estado
       * visual del pulso ambiental.
       *
       * Esto NO toca la entrada de los
       * wrappers del timeline.
       */

      p2TimelineItems.forEach(
        (item) => {
          const dot =
            item.querySelector<HTMLElement>(
              ".om-timeline-dot"
            );

          const label =
            item.querySelector<HTMLElement>(
              ".om-timeline-label"
            );

          if (dot) {
            gsap.set(dot, {
              scale: 1,
              opacity: 1,
            });
          }

          if (label) {
            gsap.set(label, {
              scale: 1,
            });
          }
        }
      );
    };

  /* ==========================================================
     ESTADO INICIAL
     ========================================================== */

  if (!prefersReducedMotion) {
    setPanelOneInitialState();
    setPanelTwoInitialState();
  }

  /* ==========================================================
     PANEL 1 — TIMELINE DE ENTRADA
     ========================================================== */

  if (
    !prefersReducedMotion &&
    p1Index &&
    p1Visual &&
    p1Fruit &&
    p1OrangeTitle &&
    p1MindsetTitle &&
    p1Vivimos &&
    p1Copy &&
    p1Divider
  ) {
    panelOneTimeline =
      gsap.timeline({
        paused: true,

        defaults: {
          ease: "power3.out",
        },
      });

    /* Índice */

    panelOneTimeline.to(
      p1Index,
      {
        opacity: 1,
        y: 0,

        duration: 0.7,
      }
    );

    /* =========================================
       COMPOSICIÓN ORANGE MINDSET
       =========================================

       Las cuatro piezas conservan SIEMPRE su top/left/bottom/
       transform del CSS. La entrada se hace con máscara + blur
       para no modificar las posiciones que ya ajustaste.
    */

    /* Naranja */

    panelOneTimeline.to(
      p1Fruit,
      {
        autoAlpha: 1,
        clipPath: "inset(0 0% 0 0)",
        filter: "blur(0px)",
        duration: 1.05,
        ease: "power3.out",
      },
      "-=0.25"
    );

    /* ORANGE */

    panelOneTimeline.to(
      p1OrangeTitle,
      {
        autoAlpha: 1,
        clipPath: "inset(0 0% 0 0)",
        filter: "blur(0px)",
        duration: 0.72,
        ease: "power3.out",
      },
      "-=0.72"
    );

    /* MINDSET — revelado desde el lado contrario */

    panelOneTimeline.to(
      p1MindsetTitle,
      {
        autoAlpha: 1,
        clipPath: "inset(0 0 0 0%)",
        filter: "blur(0px)",
        duration: 0.76,
        ease: "power3.out",
      },
      "-=0.52"
    );

    /* VIVIMOS EL */

    panelOneTimeline.to(
      p1Vivimos,
      {
        autoAlpha: 1,
        clipPath: "inset(0 0% 0 0)",
        filter: "blur(0px)",
        duration: 0.6,
        ease: "power2.out",
      },
      "-=0.48"
    );

    /*
     * Dejamos únicamente los valores de posicionamiento del CSS.
     * No limpiamos `transform`, porque nunca lo tocamos desde GSAP.
     */
    panelOneTimeline.set(
      [p1Fruit, p1OrangeTitle, p1MindsetTitle, p1Vivimos],
      {
        clearProps: "opacity,visibility,clipPath,filter",
      }
    );

    /* Copy — máquina de escribir */

    panelOneTimeline.to(
      p1CopyLetters,
      {
        opacity: 1,

        duration: 0.01,

        stagger: {
          each: 0.025,
          from: "start",
        },

        ease: "none",
      },
      "-=0.25"
    );

    /* Divider */

    panelOneTimeline.to(
      p1Divider,
      {
        scaleX: 1,

        duration: 0.8,

        ease: "power2.inOut",
      },
      "-=0.15"
    );
  }

  /* ==========================================================
     PANEL 2 — TIMELINE DE ENTRADA
     ========================================================== */

  if (
    !prefersReducedMotion &&
    panel2 &&
    p2Intro &&
    p2DescriptionWrap &&
    p2TimelineItems.length
  ) {
    panelTwoTimeline =
      gsap.timeline({
        paused: true,

        defaults: {
          ease: "power3.out",
        },
      });

    /* Intro — máquina de escribir */

    panelTwoTimeline.to(
      p2IntroLetters,
      {
        opacity: 1,

        duration: 0.01,

        stagger: {
          each: 0.025,
          from: "start",
        },

        ease: "none",
      }
    );

    /* Valores del timeline */

    panelTwoTimeline.to(
      p2TimelineItems,
      {
        opacity: 1,
        y: 0,

        duration: 0.6,

        stagger: {
          each: 0.1,
          from: "start",
        },
      },
      "-=0.1"
    );

    /* Descripción — máquina de escribir */

    panelTwoTimeline.to(
      p2DescriptionLetters,
      {
        opacity: 1,

        duration: 0.01,

        stagger: {
          each: 0.022,
          from: "start",
        },

        ease: "none",
      },
      "-=0.05"
    );

    /*
     * Cuando termina toda la entrada
     * comienza el movimiento ambiental.
     */

    panelTwoTimeline.call(() => {
      timelinePulse?.restart();
    });
  }

  /* ==========================================================
     PLAY PANEL 1
     ========================================================== */

  const playPanelOne = (): void => {
    if (
      prefersReducedMotion ||
      panelOnePlayed ||
      !panelOneTimeline
    ) {
      return;
    }

    panelOnePlayed = true;

    panelOneTimeline.restart();
  };

  /* ==========================================================
     PLAY PANEL 2
     ========================================================== */

  const playPanelTwo = (): void => {
    if (
      prefersReducedMotion ||
      panelTwoPlayed ||
      !panelTwoTimeline
    ) {
      return;
    }

    panelTwoPlayed = true;

    timelinePulse?.pause(0);

    panelTwoTimeline.restart();
  };

  /* ==========================================================
     RESET PANEL 1
     ========================================================== */

  const resetPanelOne = (): void => {
    if (
      prefersReducedMotion ||
      !panelOneTimeline
    ) {
      return;
    }

    panelOnePlayed = false;

    /*
     * No hacemos kill().
     *
     * La timeline debe permanecer viva
     * para poder reproducirse después.
     */
    panelOneTimeline.pause(0);

    setPanelOneInitialState();
  };

  /* ==========================================================
     RESET PANEL 2
     ========================================================== */

  const resetPanelTwo = (): void => {
    if (
      prefersReducedMotion ||
      !panelTwoTimeline
    ) {
      return;
    }

    panelTwoPlayed = false;

    /*
     * Primero detenemos el movimiento
     * ambiental.
     */
    timelinePulse?.pause(0);

    /*
     * La timeline sigue existiendo.
     */
    panelTwoTimeline.pause(0);

    setPanelTwoInitialState();
  };

  /* ==========================================================
     RESET COMPLETO DE ORANGE MINDSET
     ========================================================== */

  const resetOrangeMindset =
    (): void => {
      if (
        !panelOnePlayed &&
        !panelTwoPlayed
      ) {
        return;
      }

      resetPanelOne();
      resetPanelTwo();
    };

  /* ==========================================================
     DESKTOP >= 769px
     SLIDER HORIZONTAL
     ========================================================== */

  mm.add(
    "(min-width: 769px)",
    () => {
      const getTotalScroll = () =>
        slider.scrollWidth -
        section.clientWidth;

      if (
        getTotalScroll() <= 0
      ) {
        return;
      }

      /* =========================================
         SLIDER
         ========================================= */

      const tween =
        gsap.to(slider, {
          x: () =>
            -getTotalScroll(),

          ease: "none",

          scrollTrigger: {
            id:
              "orange-mindset-pin",

            trigger: section,

            start: "top top",

            end: () =>
              `+=${getTotalScroll()}`,

            pin: true,

            scrub: 1,

            anticipatePin: 1,

            invalidateOnRefresh:
              true,

            /*
             * Muy importante:
             *
             * el progreso horizontal decide
             * qué panel está entrando.
             *
             * Si regresamos desde abajo:
             * progress comienza cerca de 1,
             * así que se reproduce Panel 2.
             *
             * Cuando seguimos subiendo y
             * cruzamos hacia Panel 1,
             * éste vuelve a reproducirse.
             */

            onUpdate: (self) => {
              if (
                self.progress >= 0.5
              ) {
                playPanelTwo();
              } else {
                playPanelOne();
              }
            },
          },
        });

      /* =========================================
         FONDO / CÁSCARA
         ========================================= */

      const bgTween =
        bgLayer
          ? gsap.to(bgLayer, {
              "--peel-x": "-25%",

              ease: "none",

              scrollTrigger: {
                trigger: section,

                start: "top top",

                end: () =>
                  `+=${getTotalScroll()}`,

                scrub: 1,

                invalidateOnRefresh:
                  true,
              },
            })
          : null;

      /* =========================================
         CLEANUP DESKTOP
         ========================================= */

      return () => {
        tween.scrollTrigger?.kill(
          true
        );

        tween.kill();

        gsap.set(
          slider,
          {
            clearProps:
              "transform",
          }
        );

        bgTween?.scrollTrigger?.kill(
          true
        );

        bgTween?.kill();

        if (bgLayer) {
          gsap.set(
            bgLayer,
            {
              clearProps:
                "--peel-x",
            }
          );
        }
      };
    }
  );

  /* ==========================================================
     MOBILE <= 768px
     ========================================================== */

  mm.add(
    "(max-width: 768px)",
    () => {
      /*
       * En móvil no existe el slider
       * horizontal.
       *
       * Cada panel entra cuando llega
       * verticalmente al viewport.
       */

      const panelOneTrigger =
        ScrollTrigger.create({
          id:
            "orange-mindset-panel1-mobile",

          trigger: section,

          start: "top 75%",

          onEnter: playPanelOne,

          onEnterBack: playPanelOne,
        });

      let panelTwoTrigger:
        ScrollTrigger | null = null;

      if (panel2) {
        panelTwoTrigger =
          ScrollTrigger.create({
            id:
              "orange-mindset-panel2-mobile",

            trigger: panel2,

            start: "top 75%",

            onEnter: playPanelTwo,

            onEnterBack: playPanelTwo,
          });
      }

      return () => {
        panelOneTrigger.kill();

        panelTwoTrigger?.kill();
      };
    }
  );

  /* ==========================================================
     DETECCIÓN GLOBAL DE ENTRADA / SALIDA
     ========================================================== */

  const checkOrangePosition =
    (): void => {
      const rect =
        section.getBoundingClientRect();

      const viewportHeight =
        window.innerHeight;

      /* =====================================
         RESET AL SALIR HACIA ABAJO
         ===================================== */

      /*
       * Orange quedó arriba.
       *
       * Esto ocurre cuando seguimos
       * hacia Solutions.
       */
      const leftThroughTop =
        rect.bottom <=
        viewportHeight * 0.05;

      /* =====================================
         RESET AL SALIR HACIA ARRIBA
         ===================================== */

      /*
       * Orange quedó debajo.
       *
       * Esto ocurre cuando regresamos
       * hacia About.
       */
      const leftThroughBottom =
        rect.top >=
        viewportHeight * 0.95;

      if (
        leftThroughTop ||
        leftThroughBottom
      ) {
        resetOrangeMindset();
        return;
      }

      /* =====================================
         MOBILE
         ===================================== */

      if (
        window.innerWidth <= 768
      ) {
        return;
      }

      /* =====================================
         DESKTOP — QUÉ PANEL ESTÁ VISIBLE
         ===================================== */

      /*
       * Antes de que comience el pin,
       * ScrollTrigger.progress todavía
       * puede ser 0.
       *
       * Durante el pin usamos su
       * progreso real para saber cuál
       * panel debe entrar.
       */

      const pinTrigger =
        ScrollTrigger.getById(
          "orange-mindset-pin"
        );

      const progress =
        pinTrigger?.progress ?? 0;

      /* =====================================
         ALTURA VISIBLE
         ===================================== */

      const visibleTop =
        Math.max(
          rect.top,
          0
        );

      const visibleBottom =
        Math.min(
          rect.bottom,
          viewportHeight
        );

      const visibleHeight =
        Math.max(
          0,
          visibleBottom -
            visibleTop
        );

      const minimumVisible =
        Math.min(
          120,
          viewportHeight * 0.12
        );

      const isVisibleEnough =
        visibleHeight >=
        minimumVisible;

      /*
       * Activamos Orange antes de llegar
       * al pin completo, aproximadamente
       * como el antiguo:
       *
       * start: "top 75%"
       */
      const reachedActivationZone =
        rect.top <
          viewportHeight * 0.78 &&
        rect.bottom >
          viewportHeight * 0.05;

      if (
        !isVisibleEnough ||
        !reachedActivationZone
      ) {
        return;
      }

      /*
       * Si venimos de About:
       *
       * progress = 0
       * -> Panel 1
       *
       * Si regresamos desde Solutions:
       *
       * progress ≈ 1
       * -> Panel 2
       */

      if (progress >= 0.5) {
        playPanelTwo();
      } else {
        playPanelOne();
      }
    };

  /* ==========================================================
     LISTENERS DE VISIBILIDAD
     ========================================================== */

  window.addEventListener(
    "scroll",
    checkOrangePosition,
    {
      passive: true,
    }
  );

  window.addEventListener(
    "resize",
    checkOrangePosition,
    {
      passive: true,
    }
  );

  /* ==========================================================
     PRIMERA COMPROBACIÓN
     ========================================================== */

  requestAnimationFrame(() => {
    checkOrangePosition();
  });
}

/* ============================================================
   RESIZE
   ============================================================ */

let resizeTimer: number;

window.addEventListener(
  "resize",
  () => {
    window.clearTimeout(
      resizeTimer
    );

    resizeTimer =
      window.setTimeout(
        () => {
          ScrollTrigger.refresh();
        },
        150
      );
  }
);

/* ============================================================
   INIT
   ============================================================ */

window.addEventListener(
  "load",
  () => {
    initOrangeMindset();

    requestAnimationFrame(
      () => {
        ScrollTrigger.refresh();
      }
    );
  }
);

export {};