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

  const mobileTimelineScroll =
    section.querySelector<HTMLElement>(
      ".om-timeline"
    );

  const mobileTimelineScrollbar =
    section.querySelector<HTMLElement>(
      ".om-timeline-scrollbar"
    );

  const mobileTimelineThumb =
    section.querySelector<HTMLElement>(
      ".om-timeline-scrollbar__thumb"
    );

  const mobileTimelinePrev =
    section.querySelector<HTMLButtonElement>(
      "[data-om-timeline-prev]"
    );

  const mobileTimelineNext =
    section.querySelector<HTMLButtonElement>(
      "[data-om-timeline-next]"
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
    (forceVisible = false): void => {
      if (
        !p1Copy ||
        prefersReducedMotion ||
        isMobileViewport()
      ) {
        return;
      }

      /*
       * Cuando ya regresamos completamente
       * al panel 1, eliminamos cualquier
       * clip-path residual.
       */
      if (forceVisible) {
        gsap.set(p1Copy, {
          opacity: 1,
          clipPath: "inset(0 0 0 0)",
        });

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
       * El borde derecho de la naranja
       * funciona como entrada de la máscara.
       */
      const protection = 14;

      const eatBoundary =
        orangeRect.right - protection;

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
     MOBILE TIMELINE — SCROLLBAR VISUAL SINCRONIZADA
     ========================================================== */

  const updateMobileTimelineScrollbar =
    (): void => {
      if (
        !mobileTimelineScroll ||
        !isMobileViewport()
      ) {
        return;
      }

      const viewportWidth =
        mobileTimelineScroll.clientWidth;

      const contentWidth =
        mobileTimelineScroll.scrollWidth;

      const maxScroll =
        Math.max(
          0,
          contentWidth - viewportWidth
        );

      const currentScroll =
        mobileTimelineScroll.scrollLeft;

      const edgeTolerance = 2;

      if (mobileTimelinePrev) {
        mobileTimelinePrev.disabled =
          currentScroll <= edgeTolerance;

        mobileTimelinePrev.setAttribute(
          "aria-disabled",
          String(
            mobileTimelinePrev.disabled
          )
        );
      }

      if (mobileTimelineNext) {
        mobileTimelineNext.disabled =
          currentScroll >=
          maxScroll - edgeTolerance;

        mobileTimelineNext.setAttribute(
          "aria-disabled",
          String(
            mobileTimelineNext.disabled
          )
        );
      }

      if (
        !mobileTimelineScrollbar ||
        !mobileTimelineThumb
      ) {
        return;
      }

      if (maxScroll <= 0) {
        gsap.set(
          mobileTimelineThumb,
          {
            width: "100%",
            x: 0,
          }
        );

        return;
      }

      const ratio =
        viewportWidth / contentWidth;

      const thumbWidth =
        mobileTimelineScrollbar.clientWidth *
        ratio;

      const scrollbarTravel =
        mobileTimelineScrollbar.clientWidth -
        thumbWidth;

      const scrollProgress =
        currentScroll / maxScroll;

      const thumbX =
        scrollbarTravel *
        scrollProgress;

      gsap.set(
        mobileTimelineThumb,
        {
          width: thumbWidth,
          x: thumbX,
        }
      );
    };

  const scrollMobileTimeline =
    (
      direction: -1 | 1
    ): void => {
      if (
        !mobileTimelineScroll ||
        !isMobileViewport()
      ) {
        return;
      }

      const firstItem =
        p2TimelineItems[0];

      const itemWidth =
        firstItem
          ?.getBoundingClientRect()
          .width ?? 0;

      const styles =
        window.getComputedStyle(
          mobileTimelineScroll
        );

      const columnGap =
        Number.parseFloat(
          styles.columnGap
        ) || 0;

      const gap =
        Number.parseFloat(
          styles.gap
        ) || 0;

      const scrollStep =
        itemWidth > 0
          ? itemWidth +
            (columnGap || gap)
          : mobileTimelineScroll.clientWidth *
            0.6;

      mobileTimelineScroll.scrollBy({
        left:
          direction *
          scrollStep,

        behavior:
          prefersReducedMotion
            ? "auto"
            : "smooth",
      });
    };

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
   * Al regresar desde panel 2 NO volvemos
   * a ejecutar la máquina de escribir.
   *
   * Las letras quedan visibles y la máscara
   * se encarga de revelar el copy conforme
   * regresamos al panel 1.
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
       * Dejamos el typewriter terminado.
       */
      panelOneTextTimeline.progress(1);

      gsap.set(
        p1CopyLetters,
        {
          opacity: 1,
        }
      );

      /*
       * Sincronizamos inmediatamente la
       * máscara con la posición actual.
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
     SLIDER HORIZONTAL CON ZONAS DE PERMANENCIA
     ========================================================== */

  mm.add(
    "(min-width: 769px)",
    () => {
      const getSliderDistance = () =>
        slider.scrollWidth -
        section.clientWidth;

      /*
       * Recorrido vertical total de Orange Mindset.
       *
       * La sección se mantiene fija mientras distribuimos
       * el scroll en tres zonas:
       *
       * 0%  - 25%  -> Panel 1 quieto
       * 25% - 60%  -> transición horizontal
       * 60% - 100% -> Panel 2 quieto
       */
      const getScrollDistance = () =>
        getSliderDistance() * 2.2;

      if (getSliderDistance() <= 0) {
        return;
      }

      const PANEL_ONE_END = 0.25;
      const TRANSITION_END = 0.60;

      let previousSliderProgress = 0;

      const getSliderProgress = (
        scrollProgress: number
      ): number => {
        if (scrollProgress <= PANEL_ONE_END) {
          return 0;
        }

        if (scrollProgress >= TRANSITION_END) {
          return 1;
        }

        return gsap.utils.mapRange(
          PANEL_ONE_END,
          TRANSITION_END,
          0,
          1,
          scrollProgress
        );
      };

      const updateDesktopProgress = (
        self: ScrollTrigger
      ): void => {
        const sliderProgress =
          getSliderProgress(self.progress);

        gsap.set(slider, {
          x: -getSliderDistance() *
            sliderProgress,
        });

        if (bgLayer) {
          gsap.set(bgLayer, {
            "--peel-x": `${
              -25 * sliderProgress
            }%`,
          });
        }

        const returningToPanelOne =
          previousSliderProgress >= 0.5 &&
          sliderProgress < 0.5;

        if (sliderProgress >= 0.5) {
          updatePanelOneCopyMask();
          playPanelTwo();
        } else {
          if (returningToPanelOne) {
            revealPanelOneFromPanelTwo();
          }

          if (
            self.direction === -1 &&
            panelOnePlayed
          ) {
            updatePanelOneCopyMask();
          } else {
            playPanelOne();
            updatePanelOneCopyMask();
          }

          if (sliderProgress <= 0.01) {
            updatePanelOneCopyMask(true);
          }
        }

        previousSliderProgress =
          sliderProgress;
      };

      const pinTrigger =
        ScrollTrigger.create({
          id: "orange-mindset-pin",

          trigger: section,

          start: "top top",

          end: () =>
            `+=${getScrollDistance()}`,

          pin: true,

          anticipatePin: 1,

          invalidateOnRefresh: true,

          /*
           * No usamos snap aquí. Las zonas quietas
           * ya crean la permanencia perceptible y
           * evitamos que GSAP empuje al usuario
           * automáticamente entre los paneles.
           */
          onUpdate: (self) => {
            updateDesktopProgress(self);
          },

          onRefresh: (self) => {
            requestAnimationFrame(() => {
              updateDesktopProgress(self);
            });
          },
        });

      /*
       * Estado correcto después del primer
       * cálculo de layout.
       */
      requestAnimationFrame(() => {
        updateDesktopProgress(pinTrigger);
      });

      return () => {
        pinTrigger.kill(true);

        gsap.set(slider, {
          clearProps: "transform",
        });

        if (bgLayer) {
          gsap.set(bgLayer, {
            clearProps: "--peel-x",
          });
        }

        if (p1Copy) {
          gsap.set(p1Copy, {
            clearProps: "opacity,clipPath",
          });
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

      const handleTimelineScroll =
        (): void => {
          updateMobileTimelineScrollbar();
        };

      const handleTimelinePrev =
        (): void => {
          scrollMobileTimeline(-1);
        };

      const handleTimelineNext =
        (): void => {
          scrollMobileTimeline(1);
        };

      if (mobileTimelinePrev) {
        mobileTimelinePrev.addEventListener(
          "click",
          handleTimelinePrev
        );
      }

      if (mobileTimelineNext) {
        mobileTimelineNext.addEventListener(
          "click",
          handleTimelineNext
        );
      }

      if (mobileTimelineScroll) {
        mobileTimelineScroll.addEventListener(
          "scroll",
          handleTimelineScroll,
          {
            passive: true,
          }
        );

        requestAnimationFrame(
          () => {
            updateMobileTimelineScrollbar();
          }
        );
      }

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

            onEnter: () => {
              playPanelTwo();

              requestAnimationFrame(
                () => {
                  updateMobileTimelineScrollbar();
                }
              );
            },

            onEnterBack: () => {
              playPanelTwo();

              requestAnimationFrame(
                () => {
                  updateMobileTimelineScrollbar();
                }
              );
            },
          });
      }

      return () => {
        panelOneTrigger?.kill();
        panelTwoTrigger?.kill();

        mobileTimelineScroll?.removeEventListener(
          "scroll",
          handleTimelineScroll
        );

        mobileTimelinePrev?.removeEventListener(
          "click",
          handleTimelinePrev
        );

        mobileTimelineNext?.removeEventListener(
          "click",
          handleTimelineNext
        );
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
       * Si estamos en panel 1 completamente,
       * no calculamos la máscara geométrica:
       * quitamos directamente cualquier
       * recorte residual.
       */
      if (progress <= 0.01) {
        updatePanelOneCopyMask(true);
      } else {
        updatePanelOneCopyMask();
      }

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

        /*
         * Nuevamente garantizamos el estado
         * completamente visible al llegar
         * al inicio.
         */
        if (progress <= 0.01) {
          updatePanelOneCopyMask(true);
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