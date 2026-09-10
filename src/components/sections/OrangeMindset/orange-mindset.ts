import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getTypewriterStagger } from "../../../utils/typewriter";

gsap.registerPlugin(ScrollTrigger);

const mm = gsap.matchMedia();

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

const isMobileViewport = (): boolean =>
  window.innerWidth <= 768;

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
    const fragment =
      document.createDocumentFragment();

    [...text].forEach((character) => {
      const span =
        document.createElement("span");

      span.classList.add("om-letter");
      span.textContent = character;
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

  const rootStyles =
    getComputedStyle(
      document.documentElement
    );

  const black =
    rootStyles
      .getPropertyValue("--color-black")
      .trim() || "#000000";

  const teal =
    rootStyles
      .getPropertyValue("--color-teal2")
      .trim() || "#00b4ac";

  const timeline = gsap.timeline({
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

    const pulseStart =
      timeline.duration();

    timeline.to(
      dot,
      {
        scale: 1.45,
        duration: 0.5,
        ease: "power2.inOut",
        transformOrigin: "50% 50%",
      },
      pulseStart
    );

    timeline.to(
      dot,
      {
        backgroundColor: teal,
        duration: 0.5,
        ease: "none",
      },
      pulseStart
    );

    if (label) {
      timeline.to(
        label,
        {
          scale: 1.05,
          duration: 0.5,
          ease: "power2.inOut",
          transformOrigin: "50% 50%",
        },
        pulseStart
      );
    }

    timeline.to(
      {},
      {
        duration: 0.35,
      }
    );

    const returnStart =
      timeline.duration();

    timeline.to(
      dot,
      {
        scale: 1,
        duration: 0.5,
        ease: "power2.inOut",
      },
      returnStart
    );

    timeline.to(
      dot,
      {
        backgroundColor: black,
        duration: 0.5,
        ease: "none",
      },
      returnStart
    );

    if (label) {
      timeline.to(
        label,
        {
          scale: 1,
          duration: 0.5,
          ease: "power2.inOut",
        },
        returnStart
      );
    }

    timeline.to(
      {},
      {
        duration: 0.12,
      }
    );
  });

  return timeline;
}

/* ============================================================
   COMPOSICIÓN VISUAL
   ============================================================ */

type VisualScope = {
  index: HTMLElement | null;
  visual: HTMLElement | null;
  fruit: HTMLElement | null;
  orangeTitle: HTMLElement | null;
  mindsetTitle: HTMLElement | null;
  vivimos: HTMLElement | null;
  divider: HTMLElement | null;
};

function queryVisualScope(
  root: HTMLElement | null
): VisualScope {
  return {
    index:
      root?.querySelector<HTMLElement>(
        ".om-index"
      ) ?? null,

    visual:
      root?.querySelector<HTMLElement>(
        ".om-visual"
      ) ?? null,

    fruit:
      root?.querySelector<HTMLElement>(
        ".om-visual-fruit"
      ) ?? null,

    orangeTitle:
      root?.querySelector<HTMLElement>(
        ".om-visual-orange-title"
      ) ?? null,

    mindsetTitle:
      root?.querySelector<HTMLElement>(
        ".om-visual-mindset-title"
      ) ?? null,

    vivimos:
      root?.querySelector<HTMLElement>(
        ".om-visual-vivimos"
      ) ?? null,

    divider:
      root?.querySelector<HTMLElement>(
        ".om-divider"
      ) ?? null,
  };
}

function isVisualScopeComplete(
  scope: VisualScope
): scope is Required<VisualScope> {
  return Boolean(
    scope.index &&
      scope.visual &&
      scope.fruit &&
      scope.orangeTitle &&
      scope.mindsetTitle &&
      scope.vivimos &&
      scope.divider
  );
}

function setVisualInitialState(
  scope: VisualScope
): void {
  if (
    !isVisualScopeComplete(scope)
  ) {
    return;
  }

  const {
    index,
    visual,
    fruit,
    orangeTitle,
    mindsetTitle,
    vivimos,
    divider,
  } = scope;

  gsap.set(index, {
    opacity: 0,
    y: 20,
  });

  gsap.set(visual, {
    opacity: 1,
  });

  gsap.set(fruit, {
    autoAlpha: 0,
    clipPath: "inset(0 100% 0 0)",
    filter: "blur(6px)",
  });

  gsap.set(orangeTitle, {
    autoAlpha: 0,
    clipPath: "inset(0 100% 0 0)",
    filter: "blur(3px)",
  });

  gsap.set(mindsetTitle, {
    autoAlpha: 0,
    clipPath: "inset(0 0 0 100%)",
    filter: "blur(3px)",
  });

  gsap.set(vivimos, {
    autoAlpha: 0,
    clipPath: "inset(0 100% 0 0)",
    filter: "blur(2px)",
  });

  gsap.set(divider, {
    scaleX: 0,
    transformOrigin: "left center",
  });
}

/* ============================================================
   ENTRADA VISUAL DESKTOP
   ============================================================ */

function buildVisualEntranceTimeline(
  scope: VisualScope
): gsap.core.Timeline | null {
  if (
    !isVisualScopeComplete(scope)
  ) {
    return null;
  }

  const {
    index,
    fruit,
    orangeTitle,
    mindsetTitle,
    vivimos,
    divider,
  } = scope;

  const timeline = gsap.timeline({
    paused: true,
    defaults: {
      ease: "power3.out",
    },
  });

  timeline.to(index, {
    opacity: 1,
    y: 0,
    duration: 0.7,
  });

  timeline.to(
    fruit,
    {
      autoAlpha: 1,
      clipPath: "inset(0 0% 0 0)",
      filter: "blur(0px)",
      duration: 1.05,
      ease: "power3.out",
    },
    "-=0.25"
  );

  timeline.to(
    orangeTitle,
    {
      autoAlpha: 1,
      clipPath: "inset(0 0% 0 0)",
      filter: "blur(0px)",
      duration: 0.72,
      ease: "power3.out",
    },
    "-=0.72"
  );

  timeline.to(
    mindsetTitle,
    {
      autoAlpha: 1,
      clipPath: "inset(0 0 0 0%)",
      filter: "blur(0px)",
      duration: 0.76,
      ease: "power3.out",
    },
    "-=0.52"
  );

  timeline.to(
    vivimos,
    {
      autoAlpha: 1,
      clipPath: "inset(0 0% 0 0)",
      filter: "blur(0px)",
      duration: 0.6,
      ease: "power2.out",
    },
    "-=0.48"
  );

  timeline.set(
    [
      fruit,
      orangeTitle,
      mindsetTitle,
      vivimos,
    ],
    {
      clearProps:
        "opacity,visibility,clipPath,filter",
    }
  );

  timeline.to(
    divider,
    {
      scaleX: 1,
      duration: 0.8,
      ease: "power2.inOut",
    },
    "-=0.15"
  );

  return timeline;
}

/* ============================================================
   ENTRADA MOBILE
   ============================================================ */

function buildMobileCombinedTimeline(
  scope: VisualScope,
  copyLetters: HTMLElement[]
): gsap.core.Timeline | null {
  if (
    !isVisualScopeComplete(scope)
  ) {
    return null;
  }

  const {
    index,
    fruit,
    orangeTitle,
    mindsetTitle,
    vivimos,
    divider,
  } = scope;

  const timeline = gsap.timeline({
    paused: true,
    defaults: {
      ease: "power3.out",
    },
  });

  timeline.to(index, {
    opacity: 1,
    y: 0,
    duration: 0.7,
  });

  timeline.to(
    fruit,
    {
      autoAlpha: 1,
      clipPath: "inset(0 0% 0 0)",
      filter: "blur(0px)",
      duration: 1.05,
      ease: "power3.out",
    },
    "-=0.25"
  );

  timeline.to(
    orangeTitle,
    {
      autoAlpha: 1,
      clipPath: "inset(0 0% 0 0)",
      filter: "blur(0px)",
      duration: 0.72,
      ease: "power3.out",
    },
    "-=0.72"
  );

  timeline.to(
    mindsetTitle,
    {
      autoAlpha: 1,
      clipPath: "inset(0 0 0 0%)",
      filter: "blur(0px)",
      duration: 0.76,
      ease: "power3.out",
    },
    "-=0.52"
  );

  timeline.to(
    vivimos,
    {
      autoAlpha: 1,
      clipPath: "inset(0 0% 0 0)",
      filter: "blur(0px)",
      duration: 0.6,
      ease: "power2.out",
    },
    "-=0.48"
  );

  timeline.set(
    [
      fruit,
      orangeTitle,
      mindsetTitle,
      vivimos,
    ],
    {
      clearProps:
        "opacity,visibility,clipPath,filter",
    }
  );

  timeline.to(
    copyLetters,
    {
      opacity: 1,
      duration: 0.01,
      stagger: {
        each:
          getTypewriterStagger(
            copyLetters.length
          ),
        from: "start",
      },
      ease: "none",
    },
    "-=0.25"
  );

  timeline.to(
    divider,
    {
      scaleX: 1,
      duration: 0.8,
      ease: "power2.inOut",
    },
    "-=0.15"
  );

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
     PANEL 1 / ANCLA
     ========================================================== */

  const anchorRoot =
    section.querySelector<HTMLElement>(
      ".om-anchor"
    );

  const panel1 =
    section.querySelector<HTMLElement>(
      ".om-panel-1"
    );

  const anchorScope =
    queryVisualScope(anchorRoot);

  const mobileScope =
    queryVisualScope(panel1);

  const p1Copy =
    section.querySelector<HTMLElement>(
      ".om-panel-1 .om-copy"
    );

  /* ==========================================================
     PANEL 2
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
     LETRAS
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
      getTextLetters(
        p2Description
      );
  }

  /* ==========================================================
     EFECTO:
     LA NARANJA "SE COME" EL COPY DEL PANEL 1
     ========================================================== */

  const updatePanelOneCopyMask =
    (): void => {
      if (
        !p1Copy ||
        prefersReducedMotion ||
        isMobileViewport()
      ) {
        return;
      }

      const orange =
        anchorScope.fruit;

      if (!orange) return;

      const copyRect =
        p1Copy.getBoundingClientRect();

      const orangeRect =
        orange.getBoundingClientRect();

      /*
       * El copy se desplaza de derecha a izquierda.
       *
       * El borde DERECHO de la naranja funciona como
       * la "entrada" de la máscara.
       *
       * Un pequeño offset hace que las letras se oculten
       * ligeramente antes de atravesar visualmente la fruta.
       */
      const protection = 14;

      const eatBoundary =
        orangeRect.right - protection;

      /*
       * Si el lado izquierdo del copy está todavía
       * a la derecha del borde de la naranja:
       *
       * hiddenLeft = negativo -> no se recorta.
       *
       * Conforme el copy entra a la naranja:
       *
       * hiddenLeft aumenta -> recortamos desde la izquierda.
       */
      const hiddenLeft =
        eatBoundary - copyRect.left;

      const clippedPixels =
        gsap.utils.clamp(
          0,
          copyRect.width,
          hiddenLeft
        );

      const clippedPercent =
        copyRect.width > 0
          ? (
              clippedPixels /
              copyRect.width
            ) * 100
          : 0;

      gsap.set(p1Copy, {
        opacity: 1,

        clipPath:
          `inset(0 0 0 ${clippedPercent}%)`,
      });
    };

  /* ==========================================================
     PULSO PANEL 2
     ========================================================== */

  const timelinePulse =
    createTimelinePulse(
      p2TimelineItems
    );

  /* ==========================================================
     TIMELINES
     ========================================================== */

  const anchorTimeline =
    prefersReducedMotion
      ? null
      : buildVisualEntranceTimeline(
          anchorScope
        );

  let panelOneTextTimeline:
    | gsap.core.Timeline
    | null = null;

  if (
    !prefersReducedMotion &&
    p1CopyLetters.length
  ) {
    panelOneTextTimeline =
      gsap.timeline({
        paused: true,

        defaults: {
          ease: "power3.out",
        },
      });

    panelOneTextTimeline.to(
      p1CopyLetters,
      {
        opacity: 1,

        duration: 0.01,

        stagger: {
          each:
            getTypewriterStagger(
              p1CopyLetters.length
            ),

          from: "start",
        },

        ease: "none",
      }
    );
  }

  const mobileTimeline =
    prefersReducedMotion
      ? null
      : buildMobileCombinedTimeline(
          mobileScope,
          p1CopyLetters
        );

  let panelTwoTimeline:
    | gsap.core.Timeline
    | null = null;

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

    panelTwoTimeline.to(
      p2IntroLetters,
      {
        opacity: 1,

        duration: 0.01,

        stagger: {
          each:
            getTypewriterStagger(
              p2IntroLetters.length
            ),

          from: "start",
        },

        ease: "none",
      }
    );

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

    panelTwoTimeline.to(
      p2DescriptionLetters,
      {
        opacity: 1,

        duration: 0.01,

        stagger: {
          each:
            getTypewriterStagger(
              p2DescriptionLetters.length
            ),

          from: "start",
        },

        ease: "none",
      },
      "-=0.05"
    );

    panelTwoTimeline.call(() => {
      timelinePulse?.restart();
    });
  }

  /* ==========================================================
     ESTADOS
     ========================================================== */

  let anchorPlayed = false;
  let panelOnePlayed = false;
  let panelTwoPlayed = false;

  /* ==========================================================
     ESTADO INICIAL
     ========================================================== */

  const setPanelOneCopyInitialState =
    (): void => {
      if (!p1Copy) return;

      gsap.set(p1Copy, {
        opacity: 1,

        clipPath:
          "inset(0 0 0 0)",
      });

      gsap.set(
        p1CopyLetters,
        {
          opacity: 0,
        }
      );
    };

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

              backgroundColor:
                "var(--color-black)",
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

  if (!prefersReducedMotion) {
    setVisualInitialState(
      anchorScope
    );

    setVisualInitialState(
      mobileScope
    );

    setPanelOneCopyInitialState();
    setPanelTwoInitialState();
  }

  /* ==========================================================
     PLAY / RESET
     ========================================================== */

  const ensureAnchorVisible = (
    animate: boolean
  ): void => {
    if (
      prefersReducedMotion ||
      anchorPlayed ||
      !anchorTimeline
    ) {
      return;
    }

    anchorPlayed = true;

    if (animate) {
      anchorTimeline.restart();
    } else {
      anchorTimeline.progress(1);
    }
  };

  const playPanelOne = (): void => {
    if (
      prefersReducedMotion ||
      panelOnePlayed
    ) {
      return;
    }

    if (isMobileViewport()) {
      if (!mobileTimeline) return;

      panelOnePlayed = true;

      mobileTimeline.restart();
    } else {
      if (!panelOneTextTimeline) {
        return;
      }

      panelOnePlayed = true;

      ensureAnchorVisible(true);

      panelOneTextTimeline.restart();
    }
  };

  /*
   * Al regresar desde panel 2 NO queremos
   * volver a ejecutar la máquina de escribir.
   *
   * El texto ya queda completamente "escrito"
   * y la máscara es la que lo va revelando.
   */
  const revealPanelOneFromPanelTwo =
    (): void => {
      if (
        prefersReducedMotion ||
        isMobileViewport() ||
        !panelOneTextTimeline
      ) {
        return;
      }

      ensureAnchorVisible(false);

      panelOnePlayed = true;

      /*
       * Dejamos todas las letras visibles.
       *
       * El clip-path es el único responsable
       * de decidir qué parte del copy se ve.
       */
      panelOneTextTimeline.progress(1);

      gsap.set(
        p1CopyLetters,
        {
          opacity: 1,
        }
      );

      /*
       * Calculamos inmediatamente la máscara
       * para evitar un frame donde aparezca
       * todo el texto de golpe.
       */
      updatePanelOneCopyMask();
    };

  const playPanelTwo = (): void => {
    if (
      prefersReducedMotion ||
      panelTwoPlayed ||
      !panelTwoTimeline
    ) {
      return;
    }

    panelTwoPlayed = true;

    if (!isMobileViewport()) {
      ensureAnchorVisible(false);
    }

    timelinePulse?.pause(0);

    panelTwoTimeline.restart();
  };

  const resetAnchor = (): void => {
    if (
      prefersReducedMotion ||
      !anchorPlayed ||
      !anchorTimeline
    ) {
      return;
    }

    anchorPlayed = false;

    anchorTimeline.pause(0);

    setVisualInitialState(
      anchorScope
    );
  };

  const resetPanelOne = (): void => {
    if (
      prefersReducedMotion ||
      !panelOnePlayed
    ) {
      return;
    }

    panelOnePlayed = false;

    if (isMobileViewport()) {
      mobileTimeline?.pause(0);

      setVisualInitialState(
        mobileScope
      );
    } else {
      panelOneTextTimeline?.pause(0);
    }

    setPanelOneCopyInitialState();
  };

  const resetPanelTwo = (): void => {
    if (
      prefersReducedMotion ||
      !panelTwoTimeline
    ) {
      return;
    }

    panelTwoPlayed = false;

    timelinePulse?.pause(0);

    panelTwoTimeline.pause(0);

    setPanelTwoInitialState();
  };

  const resetOrangeMindset =
    (): void => {
      if (
        !anchorPlayed &&
        !panelOnePlayed &&
        !panelTwoPlayed
      ) {
        return;
      }

      resetPanelOne();
      resetPanelTwo();
      resetAnchor();
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

      if (getTotalScroll() <= 0) {
        return;
      }

      let previousProgress = 0;

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

            onUpdate: (self) => {
              const progress =
                self.progress;

              /*
               * Primero actualizamos la máscara.
               *
               * Esto hace que el estado visual
               * siempre corresponda a la posición
               * REAL del copy respecto a la naranja.
               */
              updatePanelOneCopyMask();

              /*
               * Detectamos cuando venimos de panel 2
               * hacia panel 1.
               */
              const returningToPanelOne =
                previousProgress >= 0.5 &&
                progress < 0.5;

              if (
                progress >= 0.5
              ) {
                playPanelTwo();
              } else {
                if (
                  returningToPanelOne
                ) {
                  revealPanelOneFromPanelTwo();
                } else if (
                  self.direction === -1 &&
                  panelOnePlayed
                ) {
                  /*
                   * Ya está reproducido.
                   * Solo dejamos que la máscara
                   * revele el contenido.
                   */
                  updatePanelOneCopyMask();
                } else {
                  playPanelOne();
                }
              }

              previousProgress =
                progress;
            },

            onRefresh: () => {
              requestAnimationFrame(
                () => {
                  updatePanelOneCopyMask();
                }
              );
            },
          },
        });

      const bgTween =
        bgLayer
          ? gsap.to(
              bgLayer,
              {
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
              }
            )
          : null;

      /*
       * Estado correcto después del primer
       * cálculo de layout.
       */
      requestAnimationFrame(
        () => {
          updatePanelOneCopyMask();
        }
      );

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

        if (p1Copy) {
          gsap.set(
            p1Copy,
            {
              clearProps:
                "opacity,clipPath",
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
      let panelOneTrigger:
        | ScrollTrigger
        | null = null;

      let panelTwoTrigger:
        | ScrollTrigger
        | null = null;

      if (panel1) {
        panelOneTrigger =
          ScrollTrigger.create({
            id:
              "orange-mindset-panel1-mobile",

            trigger: panel1,

            start:
              "top 75%",

            end:
              "bottom 25%",

            onEnter: () =>
              playPanelOne(),

            onEnterBack: () =>
              playPanelOne(),
          });
      }

      if (panel2) {
        panelTwoTrigger =
          ScrollTrigger.create({
            id:
              "orange-mindset-panel2-mobile",

            trigger: panel2,

            start:
              "top 75%",

            end:
              "bottom 25%",

            onEnter: () =>
              playPanelTwo(),

            onEnterBack: () =>
              playPanelTwo(),
          });
      }

      return () => {
        panelOneTrigger?.kill();
        panelTwoTrigger?.kill();
      };
    }
  );

  /* ==========================================================
     DETECCIÓN GLOBAL
     ========================================================== */

  const checkOrangePosition =
    (): void => {
      const rect =
        section.getBoundingClientRect();

      const viewportHeight =
        window.innerHeight;

      const RESET_BUFFER = 30;

      const leftThroughTop =
        rect.bottom <
        -RESET_BUFFER;

      const leftThroughBottom =
        rect.top >
        viewportHeight +
          RESET_BUFFER;

      if (
        leftThroughTop ||
        leftThroughBottom
      ) {
        resetOrangeMindset();
        return;
      }

      if (isMobileViewport()) {
        return;
      }

      const pinTrigger =
        ScrollTrigger.getById(
          "orange-mindset-pin"
        );

      const progress =
        pinTrigger?.progress ?? 0;

      /*
       * Sincronizamos máscara incluso
       * cuando entramos desde otra sección.
       */
      updatePanelOneCopyMask();

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

      if (
        progress >= 0.5
      ) {
        playPanelTwo();
      } else {
        /*
         * Si entramos a Orange Mindset
         * desde abajo y ya estamos dentro
         * del recorrido horizontal,
         * no hacemos typewriter otra vez.
         */
        if (
          pinTrigger &&
          pinTrigger.direction === -1 &&
          progress > 0
        ) {
          revealPanelOneFromPanelTwo();
        } else {
          playPanelOne();
        }
      }
    };

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

  requestAnimationFrame(
    () => {
      checkOrangePosition();
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