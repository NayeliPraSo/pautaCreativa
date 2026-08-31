/**
 * Footer — animaciones y lógica
 *
 * DESKTOP:
 * - La animación inicia SOLO cuando el scroll toca
 *   el fondo real de la página.
 * - La detección del fondo se hace con scroll nativo.
 * - Cuando termina la entrada, inicia movimiento ambiental continuo.
 *
 * MOBILE:
 * - Cada bloque se anima conforme entra al viewport.
 *
 * BLINDAJE:
 * - No elimina ScrollTriggers de otras secciones.
 * - Espera a que las secciones anteriores calculen su layout.
 * - Hace refresh antes de crear las animaciones.
 * - Respeta prefers-reduced-motion.
 */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ==========================================================================
   CONFIGURACIÓN
   ========================================================================== */

const BOTTOM_TOLERANCE = 2;

/**
 * Al alejarnos más de esta distancia del fondo,
 * la animación se revierte.
 */
const RESET_DISTANCE = 140;

let footerContext: gsap.Context | null = null;
let footerMM: gsap.MatchMedia | null = null;

let initFrame1 = 0;
let initFrame2 = 0;
let initFrame3 = 0;

/* ==========================================================================
   CLEANUP
   ========================================================================== */

function cleanupFooter(): void {
  if (initFrame1) {
    cancelAnimationFrame(initFrame1);
    initFrame1 = 0;
  }

  if (initFrame2) {
    cancelAnimationFrame(initFrame2);
    initFrame2 = 0;
  }

  if (initFrame3) {
    cancelAnimationFrame(initFrame3);
    initFrame3 = 0;
  }

  footerMM?.revert();
  footerMM = null;

  footerContext?.revert();
  footerContext = null;
}

/* ==========================================================================
   ESTADO INICIAL
   ========================================================================== */

function setInitialState(
  wordmark: HTMLElement,
  contact: HTMLElement,
  social: HTMLElement,
  badgeGroups: HTMLElement[],
  brandBadge: HTMLElement,
  brandMark: SVGGElement | null,
  copy: HTMLElement
): void {
  gsap.set(wordmark, {
    autoAlpha: 0,
    y: 55,
  });

  gsap.set(contact, {
    autoAlpha: 0,
    y: 32,
  });

  gsap.set(social, {
    autoAlpha: 0,
    y: 30,
  });

  gsap.set(badgeGroups, {
    autoAlpha: 0,
    y: 38,
    scale: 0.96,
    rotation: 0,
    transformOrigin: "50% 50%",
  });

  gsap.set(brandBadge, {
    autoAlpha: 0,
    scale: 0.68,
    y: 0,
    rotation: -14,
    transformOrigin: "50% 50%",
  });

  if (brandMark) {
    gsap.set(brandMark, {
      autoAlpha: 0,
      scale: 0.82,
      transformOrigin: "50% 50%",
    });
  }

  gsap.set(copy, {
    autoAlpha: 0,
    y: 22,
  });
}

/* ==========================================================================
   DESKTOP
   ========================================================================== */

function createDesktopAnimation(
  wordmark: HTMLElement,
  contact: HTMLElement,
  social: HTMLElement,
  badgeGroups: HTMLElement[],
  brandBadge: HTMLElement,
  brandMark: SVGGElement | null,
  copy: HTMLElement
): () => void {
  let hasPlayed = false;
  let isReversing = false;

  /* ==========================================================================
     RESPIRACIÓN DEL CÍRCULO
     ========================================================================== */

  const breathing = gsap.fromTo(
    brandBadge,
    {
      scale: 1,
    },
    {
      scale: 1.025,
      duration: 2.3,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      paused: true,
      immediateRender: false,
    }
  );

  /* ==========================================================================
     MOVIMIENTO AMBIENTAL
     ========================================================================== */

  const ambient = gsap.timeline({
    paused: true,
    repeat: -1,
    yoyo: true,
  });

  /* Wordmark */
  ambient.fromTo(
    wordmark,
    {
      y: 0,
    },
    {
      y: -4,
      duration: 2.8,
      ease: "sine.inOut",
      immediateRender: false,
    },
    0
  );

  /* Redes */
  ambient.fromTo(
    social,
    {
      y: 0,
      autoAlpha: 1,
    },
    {
      y: -2,
      autoAlpha: 0.82,
      duration: 2.4,
      ease: "sine.inOut",
      immediateRender: false,
    },
    0.35
  );

  /* Badges */
  badgeGroups.forEach((badge, index) => {
    ambient.fromTo(
      badge,
      {
        y: 0,
        rotation: 0,
      },
      {
        y: index % 2 === 0 ? -4 : 4,
        rotation:
          index % 2 === 0
            ? -0.8
            : 0.8,
        duration: 3 + index * 0.35,
        ease: "sine.inOut",
        transformOrigin: "50% 50%",
        immediateRender: false,
      },
      index * 0.4
    );
  });

  /* Círculo Pauta */
  ambient.fromTo(
    brandBadge,
    {
      y: 0,
      rotation: 0,
    },
    {
      y: -3,
      rotation: 1.8,
      duration: 3.4,
      ease: "sine.inOut",
      immediateRender: false,
    },
    0
  );

  /* ==========================================================================
     TIMELINE PRINCIPAL DE ENTRADA
     ========================================================================== */

  const tl = gsap.timeline({
    paused: true,
    defaults: {
      ease: "power3.out",
    },
  });

  /* Wordmark */
  tl.to(wordmark, {
    autoAlpha: 1,
    y: 0,
    duration: 1.1,
  })

    /* Contacto */
    .to(
      contact,
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
      },
      "-=0.52"
    )

    /* Redes */
    .to(
      social,
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.78,
      },
      "-=0.48"
    )

    /* Badges */
    .to(
      badgeGroups,
      {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        rotation: 0,
        duration: 0.85,
        stagger: 0.2,
      },
      "-=0.28"
    )

    /* Círculo */
    .to(
      brandBadge,
      {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        rotation: 0,
        duration: 1.15,
        ease: "back.out(1.45)",
      },
      "-=0.3"
    );

  /* Marca blanca */
  if (brandMark) {
    tl.to(
      brandMark,
      {
        autoAlpha: 1,
        scale: 1,
        duration: 0.65,
        ease: "power2.out",
      },
      "-=0.62"
    );
  }

  /* Copyright */
  tl.to(
    copy,
    {
      autoAlpha: 1,
      y: 0,
      duration: 0.7,
    },
    "-=0.25"
  );

  /* ==========================================================================
     CALLBACKS
     ========================================================================== */

  tl.eventCallback("onComplete", () => {
    isReversing = false;

    /**
     * Muy importante:
     * arrancamos siempre desde el estado base.
     */
    breathing.restart();
    ambient.restart();
  });

  tl.eventCallback(
    "onReverseComplete",
    () => {
      /**
       * Dejamos ambos movimientos exactamente
       * en su estado inicial.
       */
      breathing.pause(0);
      ambient.pause(0);

      hasPlayed = false;
      isReversing = false;
    }
  );

  /* ==========================================================================
     PLAY
     ========================================================================== */

  const playFooter = (): void => {
    if (hasPlayed) return;

    hasPlayed = true;
    isReversing = false;

    /**
     * Nos aseguramos de que las animaciones ambientales
     * estén reseteadas antes de reproducir la entrada.
     */
    breathing.pause(0);
    ambient.pause(0);

    tl.play();
  };

  /* ==========================================================================
     RESET
     ========================================================================== */

  const resetFooter = (): void => {
    if (!hasPlayed) return;
    if (isReversing) return;

    isReversing = true;

    /**
     * CORRECCIÓN IMPORTANTE:
     *
     * No creamos ningún gsap.to() adicional.
     * No usamos overwrite.
     *
     * Simplemente regresamos las timelines ambientales
     * al frame cero.
     */
    breathing.pause(0);
    ambient.pause(0);

    /**
     * Ahora la timeline principal puede hacer reverse
     * sin competir con ninguna otra animación.
     */
    tl.reverse();
  };

  /* ==========================================================================
     DETECCIÓN REAL DEL FONDO
     ========================================================================== */

  const checkScrollPosition =
    (): void => {
      const scrollingElement =
        document.scrollingElement ??
        document.documentElement;

      const scrollTop =
        scrollingElement.scrollTop;

      const viewportHeight =
        window.innerHeight;

      const documentHeight =
        scrollingElement.scrollHeight;

      const distanceFromBottom =
        documentHeight -
        (scrollTop + viewportHeight);

      /* ======================================================================
         LLEGAMOS AL FONDO
         ====================================================================== */

      if (
        distanceFromBottom <=
        BOTTOM_TOLERANCE
      ) {
        /**
         * Si estaba revirtiendo pero volvimos
         * inmediatamente al fondo, permitimos que
         * vuelva a avanzar.
         */
        if (isReversing) {
          isReversing = false;

          tl.play();

          return;
        }

        playFooter();

        return;
      }

      /* ======================================================================
         NOS ALEJAMOS DEL FONDO
         ====================================================================== */

      if (
        distanceFromBottom >
          RESET_DISTANCE &&
        hasPlayed
      ) {
        resetFooter();
      }
    };

  /* ==========================================================================
     LISTENERS NATIVOS
     ========================================================================== */

  window.addEventListener(
    "scroll",
    checkScrollPosition,
    {
      passive: true,
    }
  );

  window.addEventListener(
    "resize",
    checkScrollPosition,
    {
      passive: true,
    }
  );

  /**
   * También comprobamos el estado inicial.
   */
  requestAnimationFrame(() => {
    checkScrollPosition();
  });

  /* ==========================================================================
     CLEANUP
     ========================================================================== */

  return () => {
    window.removeEventListener(
      "scroll",
      checkScrollPosition
    );

    window.removeEventListener(
      "resize",
      checkScrollPosition
    );

    breathing.kill();
    ambient.kill();
    tl.kill();
  };
}

/* ==========================================================================
   MOBILE — CONFIG
   ========================================================================== */

interface MobileBlockOptions {
  y?: number;
  scale?: number;
  duration?: number;
  viewportRatio?: number;
}

/* ==========================================================================
   MOBILE — HELPER
   ========================================================================== */

function elementHasReachedViewportPoint(
  element: HTMLElement,
  viewportRatio: number
): boolean {
  const rect =
    element.getBoundingClientRect();

  const triggerPoint =
    window.innerHeight *
    viewportRatio;

  return rect.top <= triggerPoint;
}

/* ==========================================================================
   MOBILE — BLOQUES
   ========================================================================== */

function createMobileBlockAnimation(
  element: HTMLElement,
  id: string,
  {
    y = 35,
    scale = 1,
    duration = 0.85,
    viewportRatio = 0.86,
  }: MobileBlockOptions = {}
): () => void {
  let hasPlayed = false;

  gsap.set(element, {
    autoAlpha: 0,
    y,
    scale,
    transformOrigin: "50% 50%",
  });

  const tween = gsap.to(element, {
    autoAlpha: 1,
    y: 0,
    scale: 1,
    duration,
    ease: "power3.out",
    paused: true,
  });

  const play = (): void => {
    if (
      !elementHasReachedViewportPoint(
        element,
        viewportRatio
      )
    ) {
      return;
    }

    if (hasPlayed) return;

    hasPlayed = true;

    tween.play();
  };

  const trigger =
    ScrollTrigger.create({
      id: `footer-mobile-${id}`,

      trigger: element,

      start: `top ${
        viewportRatio * 100
      }%`,

      refreshPriority: -100,

      invalidateOnRefresh: true,

      onEnter: () => {
        play();
      },

      onEnterBack: () => {
        play();
      },

      onLeaveBack: () => {
        if (!hasPlayed) return;

        hasPlayed = false;

        tween.reverse();
      },
    });

  return () => {
    trigger.kill();
    tween.kill();
  };
}

/* ==========================================================================
   MOBILE
   ========================================================================== */

function createMobileAnimations(
  wordmark: HTMLElement,
  contact: HTMLElement,
  social: HTMLElement,
  badgeGroups: HTMLElement[],
  brandBadge: HTMLElement,
  brandMark: SVGGElement | null,
  copy: HTMLElement
): () => void {
  const cleanups: Array<
    () => void
  > = [];

  /* --------------------------------------------------------------------------
     WORDMARK
     -------------------------------------------------------------------------- */

  cleanups.push(
    createMobileBlockAnimation(
      wordmark,
      "wordmark",
      {
        y: 48,
        duration: 1,
        viewportRatio: 0.82,
      }
    )
  );

  /* --------------------------------------------------------------------------
     CONTACTO
     -------------------------------------------------------------------------- */

  cleanups.push(
    createMobileBlockAnimation(
      contact,
      "contact",
      {
        y: 30,
        duration: 0.78,
        viewportRatio: 0.86,
      }
    )
  );

  /* --------------------------------------------------------------------------
     REDES
     -------------------------------------------------------------------------- */

  cleanups.push(
    createMobileBlockAnimation(
      social,
      "social",
      {
        y: 28,
        duration: 0.75,
        viewportRatio: 0.88,
      }
    )
  );

  /* --------------------------------------------------------------------------
     BADGES
     -------------------------------------------------------------------------- */

  badgeGroups.forEach(
    (group, index) => {
      cleanups.push(
        createMobileBlockAnimation(
          group,
          `badge-${index}`,
          {
            y: 35,
            scale: 0.96,
            duration: 0.85,
            viewportRatio: 0.88,
          }
        )
      );
    }
  );

  /* ==========================================================================
     CÍRCULO PAUTA
     ========================================================================== */

  let badgePlayed = false;

  gsap.set(brandBadge, {
    autoAlpha: 0,
    y: 0,
    scale: 0.68,
    rotation: -14,
    transformOrigin: "50% 50%",
  });

  if (brandMark) {
    gsap.set(brandMark, {
      autoAlpha: 0,
      scale: 0.82,
      transformOrigin: "50% 50%",
    });
  }

  const badgeTl =
    gsap.timeline({
      paused: true,
    });

  badgeTl.to(brandBadge, {
    autoAlpha: 1,
    y: 0,
    scale: 1,
    rotation: 0,
    duration: 1.1,
    ease: "back.out(1.5)",
  });

  if (brandMark) {
    badgeTl.to(
      brandMark,
      {
        autoAlpha: 1,
        scale: 1,
        duration: 0.6,
        ease: "power2.out",
      },
      "-=0.58"
    );
  }

  /* ==========================================================================
     RESPIRACIÓN MOBILE
     ========================================================================== */

  const breathing =
    gsap.fromTo(
      brandBadge,
      {
        scale: 1,
      },
      {
        scale: 1.025,
        duration: 2.3,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        paused: true,
        immediateRender: false,
      }
    );

  /* ==========================================================================
     MOVIMIENTO AMBIENTAL MOBILE
     ========================================================================== */

  const ambient =
    gsap.fromTo(
      brandBadge,
      {
        y: 0,
        rotation: 0,
      },
      {
        y: -3,
        rotation: 1.5,
        duration: 3.2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        paused: true,
        immediateRender: false,
      }
    );

  badgeTl.eventCallback(
    "onComplete",
    () => {
      breathing.restart();
      ambient.restart();
    }
  );

  badgeTl.eventCallback(
    "onReverseComplete",
    () => {
      breathing.pause(0);
      ambient.pause(0);

      badgePlayed = false;
    }
  );

  /* --------------------------------------------------------------------------
     PLAY BADGE
     -------------------------------------------------------------------------- */

  const playBadge = (): void => {
    if (
      !elementHasReachedViewportPoint(
        brandBadge,
        0.84
      )
    ) {
      return;
    }

    if (badgePlayed) return;

    badgePlayed = true;

    breathing.pause(0);
    ambient.pause(0);

    badgeTl.play();
  };

  /* --------------------------------------------------------------------------
     TRIGGER BADGE
     -------------------------------------------------------------------------- */

  const badgeTrigger =
    ScrollTrigger.create({
      id: "footer-mobile-brand",

      trigger: brandBadge,

      start: "top 84%",

      refreshPriority: -100,

      invalidateOnRefresh: true,

      onEnter: () => {
        playBadge();
      },

      onEnterBack: () => {
        if (
          badgePlayed &&
          badgeTl.progress() >= 0.98
        ) {
          breathing.play();
          ambient.play();

          return;
        }

        playBadge();
      },

      onLeaveBack: () => {
        /**
         * Mismo criterio que desktop:
         * regresamos los movimientos ambientales
         * exactamente a cero antes del reverse.
         */
        breathing.pause(0);
        ambient.pause(0);

        if (badgePlayed) {
          badgeTl.reverse();
        }
      },
    });

  cleanups.push(() => {
    badgeTrigger.kill();

    badgeTl.kill();
    breathing.kill();
    ambient.kill();
  });

  /* --------------------------------------------------------------------------
     COPYRIGHT
     -------------------------------------------------------------------------- */

  cleanups.push(
    createMobileBlockAnimation(
      copy,
      "copy",
      {
        y: 22,
        duration: 0.7,
        viewportRatio: 0.91,
      }
    )
  );

  /* --------------------------------------------------------------------------
     CLEANUP MOBILE
     -------------------------------------------------------------------------- */

  return () => {
    cleanups.forEach(
      (cleanup) => {
        cleanup();
      }
    );
  };
}

/* ==========================================================================
   CREAR ANIMACIONES
   ========================================================================== */

function createFooterAnimations(
  footer: HTMLElement
): void {
  footerMM = gsap.matchMedia();

  /* =========================================================================
     DESKTOP
     ========================================================================= */

  footerMM.add(
    "(min-width: 769px)",
    () => {
      const wordmark =
        footer.querySelector<HTMLElement>(
          ".footer-wordmark"
        );

      const contact =
        footer.querySelector<HTMLElement>(
          ".footer-contact"
        );

      const social =
        footer.querySelector<HTMLElement>(
          ".footer-social"
        );

      const badgeGroups =
        gsap.utils.toArray<HTMLElement>(
          ".footer-badges-group",
          footer
        );

      const brandBadge =
        footer.querySelector<HTMLElement>(
          ".footer-brand-badge"
        );

      const brandMark =
        footer.querySelector<SVGGElement>(
          ".footer-brand-badge__mark"
        );

      const copy =
        footer.querySelector<HTMLElement>(
          ".footer-copy"
        );

      if (
        !wordmark ||
        !contact ||
        !social ||
        !brandBadge ||
        !copy
      ) {
        return;
      }

      return createDesktopAnimation(
        wordmark,
        contact,
        social,
        badgeGroups,
        brandBadge,
        brandMark,
        copy
      );
    }
  );

  /* =========================================================================
     MOBILE
     ========================================================================= */

  footerMM.add(
    "(max-width: 768px)",
    () => {
      const wordmark =
        footer.querySelector<HTMLElement>(
          ".footer-wordmark"
        );

      const contact =
        footer.querySelector<HTMLElement>(
          ".footer-contact"
        );

      const social =
        footer.querySelector<HTMLElement>(
          ".footer-social"
        );

      const badgeGroups =
        gsap.utils.toArray<HTMLElement>(
          ".footer-badges-group",
          footer
        );

      const brandBadge =
        footer.querySelector<HTMLElement>(
          ".footer-brand-badge"
        );

      const brandMark =
        footer.querySelector<SVGGElement>(
          ".footer-brand-badge__mark"
        );

      const copy =
        footer.querySelector<HTMLElement>(
          ".footer-copy"
        );

      if (
        !wordmark ||
        !contact ||
        !social ||
        !brandBadge ||
        !copy
      ) {
        return;
      }

      return createMobileAnimations(
        wordmark,
        contact,
        social,
        badgeGroups,
        brandBadge,
        brandMark,
        copy
      );
    }
  );

  ScrollTrigger.sort();
}

/* ==========================================================================
   INIT
   ========================================================================== */

function initFooter(): void {
  cleanupFooter();

  const footer =
    document.querySelector<HTMLElement>(
      "[data-footer]"
    );

  if (!footer) return;

  /* ==========================================================================
     REDUCED MOTION
     ========================================================================== */

  const prefersReducedMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

  if (prefersReducedMotion) {
    return;
  }

  /* ==========================================================================
     ESTADO INICIAL
     ========================================================================== */

  footerContext = gsap.context(
    () => {
      const wordmark =
        footer.querySelector<HTMLElement>(
          ".footer-wordmark"
        );

      const contact =
        footer.querySelector<HTMLElement>(
          ".footer-contact"
        );

      const social =
        footer.querySelector<HTMLElement>(
          ".footer-social"
        );

      const badgeGroups =
        gsap.utils.toArray<HTMLElement>(
          ".footer-badges-group",
          footer
        );

      const brandBadge =
        footer.querySelector<HTMLElement>(
          ".footer-brand-badge"
        );

      const brandMark =
        footer.querySelector<SVGGElement>(
          ".footer-brand-badge__mark"
        );

      const copy =
        footer.querySelector<HTMLElement>(
          ".footer-copy"
        );

      if (
        !wordmark ||
        !contact ||
        !social ||
        !brandBadge ||
        !copy
      ) {
        return;
      }

      setInitialState(
        wordmark,
        contact,
        social,
        badgeGroups,
        brandBadge,
        brandMark,
        copy
      );
    },
    footer
  );

  /* ==========================================================================
     SINCRONIZACIÓN
     ========================================================================== */

  initFrame1 =
    requestAnimationFrame(() => {
      initFrame2 =
        requestAnimationFrame(() => {
          ScrollTrigger.sort();

          ScrollTrigger.refresh();

          initFrame3 =
            requestAnimationFrame(() => {
              createFooterAnimations(
                footer
              );
            });
        });
    });
}

/* ==========================================================================
   BOOT
   ========================================================================== */

function bootFooter(): void {
  initFooter();
}

/* ==========================================================================
   PRIMERA CARGA
   ========================================================================== */

if (
  document.readyState ===
  "complete"
) {
  bootFooter();
} else {
  window.addEventListener(
    "load",
    bootFooter,
    {
      once: true,
    }
  );
}

/* ==========================================================================
   ASTRO VIEW TRANSITIONS
   ========================================================================== */

document.addEventListener(
  "astro:page-load",
  () => {
    if (
      document.readyState !==
      "complete"
    ) {
      return;
    }

    bootFooter();
  }
);