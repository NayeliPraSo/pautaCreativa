import gsap from "gsap";

import {
  getTypewriterStagger,
} from "../../../utils/typewriter";

let cleanupRecognition: (() => void) | null = null;

/* ============================================================
   HELPERS
   ============================================================ */

function splitTextIntoLetters(
  element: HTMLElement,
  className = "recognition-letter",
): HTMLElement[] {
  const letters: HTMLElement[] = [];

  const processNode = (node: Node): void => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent ?? "";
      const fragment = document.createDocumentFragment();

      [...text].forEach((char) => {
        if (/\s/.test(char)) {
          fragment.appendChild(document.createTextNode(char));
          return;
        }

        const span = document.createElement("span");
        span.className = className;
        span.textContent = char;
        span.style.display = "inline-block";

        fragment.appendChild(span);
        letters.push(span);
      });

      node.parentNode?.replaceChild(fragment, node);
      return;
    }

    Array.from(node.childNodes).forEach(processNode);
  };

  processNode(element);
  return letters;
}

function getLetters(
  element: HTMLElement,
  className = "recognition-letter",
): HTMLElement[] {
  const splitKey = `split${className.replace(/[^a-zA-Z0-9]/g, "")}`;

  if (element.dataset[splitKey] === "true") {
    return Array.from(
      element.querySelectorAll<HTMLElement>(`.${className}`),
    );
  }

  const letters = splitTextIntoLetters(element, className);
  element.dataset[splitKey] = "true";

  return letters;
}

function isActuallyVisible(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();

  if (rect.bottom <= 0 || rect.top >= window.innerHeight) {
    return false;
  }

  const visibleTop = Math.max(rect.top, 0);
  const visibleBottom = Math.min(rect.bottom, window.innerHeight);
  const visibleHeight = Math.max(0, visibleBottom - visibleTop);

  if (visibleHeight < Math.min(80, rect.height * 0.08)) {
    return false;
  }

  const sampleY = Math.min(
    Math.max(visibleTop + Math.min(80, visibleHeight * 0.35), 0),
    window.innerHeight - 1,
  );

  const sampleXs = [
    window.innerWidth * 0.2,
    window.innerWidth * 0.5,
    window.innerWidth * 0.8,
  ];

  return sampleXs.some((x) => {
    const topElement = document.elementFromPoint(x, sampleY);

    return Boolean(
      topElement &&
        (topElement === element || element.contains(topElement)),
    );
  });
}

function createRealVisibilityTrigger(
  element: HTMLElement,
  onEnter: () => void,
  onLeave: () => void,
  rootMargin = "0px 0px -15% 0px",
): () => void {
  let isArmedForReplay = true;
  let hasPlayed = false;
  let checkFrame = 0;

  const checkPosition = (): void => {
    const rect = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    const leftThroughTop =
      rect.bottom <= viewportHeight * 0.05;

    const leftThroughBottom =
      rect.top >= viewportHeight * 0.95;

    if (leftThroughTop || leftThroughBottom) {
      if (hasPlayed && !isArmedForReplay) {
        hasPlayed = false;
        isArmedForReplay = true;
        onLeave();
      }

      return;
    }

    if (!isArmedForReplay) return;
    if (!isActuallyVisible(element)) return;

    const activationLine = viewportHeight * 0.85;
    if (rect.top > activationLine) return;

    isArmedForReplay = false;
    hasPlayed = true;
    onEnter();
  };

  const scheduleCheck = (): void => {
    if (checkFrame) return;

    checkFrame = requestAnimationFrame(() => {
      checkFrame = 0;
      checkPosition();
    });
  };

  const observer = new IntersectionObserver(
    () => {
      scheduleCheck();
    },
    {
      root: null,
      threshold: [0, 0.05, 0.1, 0.2],
      rootMargin,
    },
  );

  observer.observe(element);

  window.addEventListener("scroll", scheduleCheck, {
    passive: true,
  });

  window.addEventListener("resize", scheduleCheck, {
    passive: true,
  });

  requestAnimationFrame(scheduleCheck);

  return () => {
    observer.disconnect();

    window.removeEventListener("scroll", scheduleCheck);
    window.removeEventListener("resize", scheduleCheck);

    if (checkFrame) {
      cancelAnimationFrame(checkFrame);
      checkFrame = 0;
    }
  };
}

function animateCounter(
  element: HTMLElement,
  target: number,
): gsap.core.Tween {
  const state = { value: 1 };

  element.textContent = "#1";

  const duration = gsap.utils.clamp(
    0.4,
    0.8,
    0.32 + target * 0.025,
  );

  return gsap.to(state, {
    value: target,
    duration,
    ease: "none",
    onUpdate: () => {
      element.textContent = `#${Math.round(state.value)}`;
    },
    onComplete: () => {
      element.textContent = `#${target}`;
    },
  });
}

/* ============================================================
   INIT
   ============================================================ */

function initRecognition(): void {
  cleanupRecognition?.();
  cleanupRecognition = null;

  const section =
    document.querySelector<HTMLElement>("#recognition");

  if (!section) return;

  const clientsBlock =
    section.querySelector<HTMLElement>(
      ".recognition__clients-content",
    );

  const industryBlock =
    section.querySelector<HTMLElement>(
      ".recognition__industry",
    );

  if (!clientsBlock || !industryBlock) return;

  const prefersReducedMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

  const cleanupFns: Array<() => void> = [];
  const counterTweens: gsap.core.Tween[] = [];
  const timelines: gsap.core.Timeline[] = [];
  const ambientTweens: gsap.core.Tween[] = [];
  const ambientTimelines: gsap.core.Timeline[] = [];

  /* ==========================================================
     BLOQUE 1 — LO DICEN NUESTROS CLIENTES
     ========================================================== */

  const badge =
    clientsBlock.querySelector<HTMLElement>(
      ".recognition__clients-badge",
    );

  const topLine =
    clientsBlock.querySelector<HTMLElement>(
      ".recognition__line--top",
    );

  const numberOne =
    clientsBlock.querySelector<HTMLElement>(
      ".recognition__ranking-number",
    );

  const verticalLine =
    clientsBlock.querySelector<HTMLElement>(
      ".recognition__line--vertical",
    );

  const categoryParagraphs = Array.from(
    clientsBlock.querySelectorAll<HTMLElement>(
      ".recognition__ranking-categories p",
    ),
  );

  const rankingLine =
    clientsBlock.querySelector<HTMLElement>(
      ".recognition__line--ranking",
    );

  const statementParagraphs = Array.from(
    clientsBlock.querySelectorAll<HTMLElement>(
      ".recognition__statements p",
    ),
  );

  const statementsLine =
    clientsBlock.querySelector<HTMLElement>(
      ".recognition__line--statements",
    );

  const integratedParagraph =
    clientsBlock.querySelector<HTMLElement>(
      ".recognition__integrated p",
    );

  const sectionLine =
    clientsBlock.querySelector<HTMLElement>(
      ".recognition__line--section",
    );

  const categoryLetters = categoryParagraphs.map(
    (paragraph) =>
      getLetters(
        paragraph,
        "recognition-type-letter",
      ),
  );

  const statementLetters = statementParagraphs.map(
    (paragraph) =>
      getLetters(
        paragraph,
        "recognition-type-letter",
      ),
  );

  const integratedLetters = integratedParagraph
    ? getLetters(
        integratedParagraph,
        "recognition-type-letter",
      )
    : [];

  const setClientsInitialState = (): void => {
    if (topLine) {
      gsap.set(topLine, {
        scaleX: 0,
        transformOrigin: "left center",
      });
    }

    if (badge) {
      gsap.set(badge, {
        autoAlpha: 0,
        scale: 0.88,
        y: 18,
        rotation: 0,
        transformOrigin: "center center",
      });
    }

    if (numberOne) {
      gsap.set(numberOne, {
        autoAlpha: 0,
        x: 0,
        y: 0,
        scale: 0.82,
        scaleX: 1,
        scaleY: 1,
        rotation: 0,
        transformOrigin: "center bottom",
      });
    }

    if (verticalLine) {
      gsap.set(verticalLine, {
        scaleY: 0,
        transformOrigin: "top center",
      });
    }

    categoryLetters.flat().forEach((letter) => {
      gsap.set(letter, {
        autoAlpha: 0,
      });
    });

    if (rankingLine) {
      gsap.set(rankingLine, {
        scaleX: 0,
        transformOrigin: "left center",
      });
    }

    statementLetters.flat().forEach((letter) => {
      gsap.set(letter, {
        autoAlpha: 0,
      });
    });

    if (statementsLine) {
      gsap.set(statementsLine, {
        scaleX: 0,
        transformOrigin: "left center",
      });
    }

    integratedLetters.forEach((letter) => {
      gsap.set(letter, {
        autoAlpha: 0,
      });
    });

    if (sectionLine) {
      sectionLine.classList.remove("is-alive");

      gsap.set(sectionLine, {
        clipPath: "inset(0 100% 0 0)",
      });
    }
  };

  if (!prefersReducedMotion) {
    setClientsInitialState();
  }

  /* ==========================================================
     AMBIENTAL — #1
     Golpe vertical + squash/stretch + salto + aterrizaje
     ========================================================== */

  const numberOneBounce =
    numberOne && !prefersReducedMotion
      ? gsap.timeline({
          repeat: -1,
          repeatDelay: 3,
          paused: true,
        })
          .to(numberOne, {
            scaleX: 1.04,
            scaleY: 0.96,
            duration: 0.16,
            ease: "power2.in",
            transformOrigin: "center bottom",
          })
          .to(numberOne, {
            y: -9,
            scaleX: 0.98,
            scaleY: 1.04,
            duration: 0.26,
            ease: "power2.out",
          })
          .to(numberOne, {
            y: 0,
            scaleX: 1,
            scaleY: 1,
            duration: 0.48,
            ease: "bounce.out",
          })
      : null;

  const badgeFloat =
    badge && !prefersReducedMotion
      ? gsap.fromTo(
          badge,
          {
            y: 0,
            rotation: 0,
          },
          {
            y: -5,
            rotation: 0.35,
            duration: 3.4,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            paused: true,
            immediateRender: false,
            transformOrigin: "center center",
          },
        )
      : null;

  if (numberOneBounce) {
    ambientTimelines.push(numberOneBounce);
  }

  if (badgeFloat) {
    ambientTweens.push(badgeFloat);
  }

  const clientsTimeline = gsap.timeline({
    paused: true,
    onComplete: () => {
      numberOneBounce?.restart();
      badgeFloat?.restart();
      sectionLine?.classList.add("is-alive");
    },
  });

  timelines.push(clientsTimeline);

  if (!prefersReducedMotion) {
    if (topLine) {
      clientsTimeline.to(topLine, {
        scaleX: 1,
        duration: 0.45,
        ease: "power2.inOut",
      });
    }

    if (badge) {
      clientsTimeline.to(
        badge,
        {
          autoAlpha: 1,
          scale: 1,
          y: 0,
          duration: 0.5,
          ease: "back.out(1.35)",
        },
        "-=0.15",
      );
    }

    if (numberOne) {
      clientsTimeline.to(
        numberOne,
        {
          autoAlpha: 1,
          scale: 1,
          scaleX: 1,
          scaleY: 1,
          y: 0,
          duration: 0.5,
          ease: "back.out(1.55)",
        },
        "-=0.2",
      );
    }

    if (verticalLine) {
      clientsTimeline.to(verticalLine, {
        scaleY: 1,
        duration: 0.4,
        ease: "power2.inOut",
      });
    }

    categoryLetters.forEach((letters) => {
      clientsTimeline.to(
        letters,
        {
          autoAlpha: 1,
          duration: 0.02,
          stagger: {
            each: getTypewriterStagger(letters.length),
            from: "start",
          },
          ease: "none",
        },
        "-=0.1",
      );
    });

    if (rankingLine) {
      clientsTimeline.to(rankingLine, {
        scaleX: 1,
        duration: 0.4,
        ease: "power2.inOut",
      });
    }

    statementLetters.forEach((letters) => {
      clientsTimeline.to(
        letters,
        {
          autoAlpha: 1,
          duration: 0.02,
          stagger: {
            each: getTypewriterStagger(letters.length),
            from: "start",
          },
          ease: "none",
        },
        "-=0.1",
      );
    });

    if (statementsLine) {
      clientsTimeline.to(statementsLine, {
        scaleX: 1,
        duration: 0.4,
        ease: "power2.inOut",
      });
    }

    if (integratedLetters.length) {
      clientsTimeline.to(
        integratedLetters,
        {
          autoAlpha: 1,
          duration: 0.02,
          stagger: {
            each: getTypewriterStagger(integratedLetters.length),
            from: "start",
          },
          ease: "none",
        },
        "-=0.1",
      );
    }

    if (sectionLine) {
      clientsTimeline.to(sectionLine, {
        clipPath: "inset(0 0% 0 0)",
        duration: 0.55,
        ease: "power2.inOut",
      });

      clientsTimeline.set(sectionLine, {
        clearProps: "clipPath",
      });
    }
  }

  const playClients = (): void => {
    if (prefersReducedMotion) return;

    numberOneBounce?.pause();
    badgeFloat?.pause();

    setClientsInitialState();
    clientsTimeline.restart();
  };

  const resetClients = (): void => {
    if (prefersReducedMotion) return;

    numberOneBounce?.pause(0);
    badgeFloat?.pause(0);

    clientsTimeline.pause(0);
    setClientsInitialState();
  };

  /* ==========================================================
     BLOQUE 2 — RECONOCIMIENTOS DE LA INDUSTRIA
     ========================================================== */

  const industryTitle =
    industryBlock.querySelector<HTMLElement>(
      ".recognition__industry-title",
    );

  const awards = Array.from(
    industryBlock.querySelectorAll<HTMLElement>(
      ".recognition__award",
    ),
  );

  const timeline =
    industryBlock.querySelector<HTMLElement>(
      ".recognition__timeline",
    );

  const timelineItems = Array.from(
    industryBlock.querySelectorAll<HTMLElement>(
      ".recognition__timeline-item",
    ),
  );

  const rankings = timelineItems.map((item) => {
    const number =
      item.querySelector<HTMLElement>(
        ".recognition__timeline-number",
      );

    const label =
      item.querySelector<HTMLElement>(
        ".recognition__timeline-label",
      );

    const rawTarget =
      number?.textContent?.replace(/[^0-9]/g, "") ?? "0";

    const target =
      Number.parseInt(rawTarget, 10) || 0;

    const letters = label
      ? getLetters(
          label,
          "recognition-glow-letter",
        )
      : [];

    return {
      item,
      number,
      label,
      target,
      letters,
    };
  });

  const awardIcons = awards
    .map((award) =>
      award.querySelector<HTMLElement>(
        ".recognition__award-icon",
      ),
    )
    .filter(
      (icon): icon is HTMLElement =>
        Boolean(icon),
    );

  const rankingAccentTexts = rankings
    .map(({ label }) =>
      label?.querySelector<HTMLElement>("strong") ?? null,
    )
    .filter(
      (element): element is HTMLElement =>
        Boolean(element),
    );

  const stopCounterAnimations = (): void => {
    counterTweens.forEach((tween) => {
      tween.kill();
    });

    counterTweens.length = 0;
  };

  const setIndustryInitialState = (): void => {
    stopCounterAnimations();

    if (industryTitle) {
      gsap.set(industryTitle, {
        autoAlpha: 0,
        y: 28,
      });
    }

    if (awards.length) {
      gsap.set(awards, {
        autoAlpha: 0,
        y: 22,
        scale: 0.9,
        transformOrigin: "center center",
      });
    }

    awardIcons.forEach((icon) => {
      gsap.set(icon, {
        scale: 1,
        y: 0,
      });
    });

    rankings.forEach(
      ({ number, target, letters, item }) => {
        if (number) {
          number.textContent =
            target > 0
              ? "#1"
              : number.textContent;

          gsap.set(number, {
            autoAlpha: 0,
            y: 18,
            scale: 1,
          });
        }

        gsap.set(item, {
          x: 0,
        });

        letters.forEach((letter) => {
          gsap.set(letter, {
            opacity: 0.12,
            filter: "blur(0.8px)",
          });
        });
      },
    );

    rankingAccentTexts.forEach((accent) => {
      gsap.set(accent, {
        opacity: 1,
      });
    });

    if (
      timeline &&
      window.innerWidth > 768
    ) {
      gsap.set(timeline, {
        clipPath: "inset(0 100% 0 0)",
      });
    }
  };

  if (!prefersReducedMotion) {
    setIndustryInitialState();
  }

  const ambientWave = gsap.timeline({
    repeat: -1,
    repeatDelay: 1.8,
    paused: true,
  });

  if (!prefersReducedMotion) {
    awardIcons.forEach((icon) => {
      ambientWave.to(icon, {
        scale: 1.065,
        y: -3,
        duration: 0.42,
        ease: "sine.out",
        transformOrigin: "center center",
      });

      ambientWave.to(icon, {
        scale: 1,
        y: 0,
        duration: 0.52,
        ease: "sine.inOut",
      });
    });

    ambientWave.to({}, {
      duration: 0.45,
    });

    rankings.forEach(
      ({ number, item }, index) => {
        if (!number) return;

        const accent =
          rankingAccentTexts[index];

        ambientWave.to(number, {
          scale: 1.07,
          y: -2,
          duration: 0.34,
          ease: "sine.out",
          transformOrigin: "left center",
        });

        if (accent) {
          ambientWave.to(
            accent,
            {
              opacity: 0.68,
              duration: 0.22,
              ease: "sine.out",
            },
            "<",
          );
        }

        ambientWave.to(number, {
          scale: 1,
          y: 0,
          duration: 0.46,
          ease: "sine.inOut",
        });

        if (accent) {
          ambientWave.to(
            accent,
            {
              opacity: 1,
              duration: 0.38,
              ease: "sine.inOut",
            },
            "<",
          );
        }

        ambientWave.fromTo(
          item,
          {
            x: 0,
          },
          {
            x: 2,
            duration: 0.16,
            yoyo: true,
            repeat: 1,
            ease: "sine.inOut",
          },
          "-=0.36",
        );
      },
    );
  }

  ambientTimelines.push(ambientWave);

  const industryTimeline = gsap.timeline({
    paused: true,
    onComplete: () => {
      ambientWave.restart();
    },
  });

  timelines.push(industryTimeline);

  if (!prefersReducedMotion) {
    if (industryTitle) {
      industryTimeline.to(industryTitle, {
        autoAlpha: 1,
        y: 0,
        duration: 0.5,
        ease: "power3.out",
      });
    }

    industryTimeline.to(
      awards,
      {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 0.45,
        stagger: 0.1,
        ease: "back.out(1.35)",
      },
      "-=0.2",
    );

    if (
      timeline &&
      window.innerWidth > 768
    ) {
      industryTimeline.to(timeline, {
        clipPath: "inset(0 0% 0 0)",
        duration: 0.65,
        ease: "power2.inOut",
      });

      industryTimeline.set(timeline, {
        clearProps: "clipPath",
      });
    }

    rankings.forEach(
      ({ number, target, letters }) => {
        if (!number || target <= 0) return;

        industryTimeline.to(number, {
          autoAlpha: 1,
          y: 0,
          duration: 0.2,
          ease: "power2.out",
        });

        industryTimeline.add(() => {
          const counterTween =
            animateCounter(
              number,
              target,
            );

          counterTweens.push(
            counterTween,
          );
        });

        const counterDuration =
          gsap.utils.clamp(
            0.4,
            0.8,
            0.32 + target * 0.025,
          );

        industryTimeline.to(
          {},
          {
            duration:
              counterDuration,
          },
        );

        if (letters.length) {
          industryTimeline.to(
            letters,
            {
              opacity: 1,
              filter: "blur(0px)",
              duration: 0.1,
              stagger: {
                each: getTypewriterStagger(letters.length),
                from: "start",
              },
              ease: "power1.out",
            },
            "-=0.15",
          );
        }
      },
    );
  }

  const playIndustry = (): void => {
    if (prefersReducedMotion) return;

    ambientWave.pause(0);
    setIndustryInitialState();
    industryTimeline.restart();
  };

  const resetIndustry = (): void => {
    if (prefersReducedMotion) return;

    ambientWave.pause(0);
    industryTimeline.pause(0);
    setIndustryInitialState();
  };

  /* ==========================================================
     DISPARADORES POR VISIBILIDAD REAL
     ========================================================== */

  if (prefersReducedMotion) {
    cleanupRecognition = () => {};
    return;
  }

  const stopClientsTrigger =
    createRealVisibilityTrigger(
      clientsBlock,
      playClients,
      resetClients,
      "0px 0px -12% 0px",
    );

  const stopIndustryTrigger =
    createRealVisibilityTrigger(
      industryBlock,
      playIndustry,
      resetIndustry,
      "0px 0px -12% 0px",
    );

  cleanupFns.push(
    stopClientsTrigger,
    stopIndustryTrigger,
  );

  cleanupRecognition = () => {
    cleanupFns.forEach((fn) => fn());

    stopCounterAnimations();

    timelines.forEach((tl) => {
      tl.kill();
    });

    ambientTweens.forEach((tween) => {
      tween.kill();
    });

    ambientTimelines.forEach((tl) => {
      tl.kill();
    });

    sectionLine?.classList.remove("is-alive");
  };
}

/* ============================================================
   ARRANQUE
   ============================================================ */

initRecognition();

export {};
