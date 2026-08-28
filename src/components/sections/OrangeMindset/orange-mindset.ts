import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const mm = gsap.matchMedia();

const prefersReducedMotion = window.matchMedia(
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

  const walker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_TEXT
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

      /*
       * Pausa al terminar el último
       * antes de volver al primero.
       */
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

      transformOrigin:
        "50% 50%",
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

          transformOrigin:
            "50% 50%",
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

function initOrangeMindset() {
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

  const p1Circle =
    section.querySelector<HTMLElement>(
      ".om-panel-1 .om-circle"
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
     PULSO AMBIENTAL DEL TIMELINE
     ========================================================== */

  const timelinePulse =
    createTimelinePulse(
      p2TimelineItems
    );

  /* ==========================================================
     PANEL 1 — ENTRADA
     ========================================================== */

  if (
    !prefersReducedMotion &&
    p1Index &&
    p1Circle &&
    p1Copy &&
    p1Divider
  ) {
    gsap.set(p1Index, {
      opacity: 0,
      y: 20,
    });

    gsap.set(p1Circle, {
      opacity: 0,
      scale: 0.6,

      transformOrigin:
        "50% 50%",
    });

    /*
     * El contenedor permanece visible.
     * Solo ocultamos las letras.
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

    gsap.timeline({
      scrollTrigger: {
        id:
          "orange-mindset-panel1-entrance",

        trigger: section,

        start: "top 75%",

        once: true,
      },

      defaults: {
        ease: "power3.out",
      },
    })

      /* Índice */

      .to(p1Index, {
        opacity: 1,
        y: 0,

        duration: 0.7,
      })

      /* Círculo */

      .to(
        p1Circle,
        {
          opacity: 1,
          scale: 1,

          duration: 1,

          ease:
            "back.out(1.6)",
        },
        "-=0.25"
      )

      /* Copy — máquina de escribir */

      .to(
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
      )

      /* Divider */

      .to(
        p1Divider,
        {
          scaleX: 1,

          duration: 0.8,

          ease:
            "power2.inOut",
        },
        "-=0.15"
      );
  }

  /* ==========================================================
     PANEL 2 — ENTRADA
     ========================================================== */

  let panelTwoPlayed = false;

  let panelTwoTimeline:
    gsap.core.Timeline | null = null;

  if (
    !prefersReducedMotion &&
    panel2 &&
    p2Intro &&
    p2DescriptionWrap &&
    p2TimelineItems.length
  ) {
    /* =========================================
       INTRO
       ========================================= */

    gsap.set(p2Intro, {
      opacity: 1,
    });

    gsap.set(
      p2IntroLetters,
      {
        opacity: 0,
      }
    );

    /* =========================================
       ITEMS
       ========================================= */

    gsap.set(
      p2TimelineItems,
      {
        opacity: 0,
        y: 20,
      }
    );

    /* =========================================
       DESCRIPCIÓN
       ========================================= */

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

    /* =========================================
       TIMELINE COMPLETA
       ========================================= */

    panelTwoTimeline =
      gsap.timeline({
        paused: true,

        defaults: {
          ease: "power3.out",
        },
      })

        /* Intro — máquina de escribir */

        .to(
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
        )

        /* Valores del timeline */

        .to(
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
        )

        /* Descripción — máquina de escribir */

        .to(
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
        )

        /* =====================================
           INICIAR PULSO SECUENCIAL
           ===================================== */

        .call(() => {
          /*
           * Solo comienza cuando toda
           * la entrada ya terminó.
           */

          timelinePulse?.restart();
        });
  }

  /* ==========================================================
     REPRODUCIR PANEL 2 SOLO UNA VEZ
     ========================================================== */

  function playPanelTwoOnce() {
    if (
      panelTwoPlayed ||
      !panelTwoTimeline
    ) {
      return;
    }

    panelTwoPlayed = true;

    panelTwoTimeline.play();
  }

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
             * Cuando el usuario supera
             * la mitad del recorrido,
             * entra el panel 2.
             */

            onUpdate: (self) => {
              if (
                self.progress >= 0.5
              ) {
                playPanelTwoOnce();
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
              "--peel-x":
                "-25%",

              ease: "none",

              scrollTrigger: {
                trigger:
                  section,

                start:
                  "top top",

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
     PANEL 2 POR SCROLL VERTICAL
     ========================================================== */

  mm.add(
    "(max-width: 768px)",
    () => {
      if (!panel2) {
        return;
      }

      const panelTwoTrigger =
        ScrollTrigger.create({
          id:
            "orange-mindset-panel2-mobile",

          trigger: panel2,

          start: "top 75%",

          once: true,

          onEnter:
            playPanelTwoOnce,
        });

      return () => {
        panelTwoTrigger.kill();
      };
    }
  );
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