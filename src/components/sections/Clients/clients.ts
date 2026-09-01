/**
 * Clients — animaciones y lógica
 * Toda la interacción/animación de esta sección vive aquí.
 */

import gsap from "gsap";

/* ============================================================
   ESTADO / CLEANUP
   ============================================================ */

let cleanupCurrentPage:
  (() => void) | null = null;

/* ============================================================
   UTILIDAD:
   comprueba que la sección esté realmente visible
   ============================================================ */

function isElementActuallyVisible(
  element: HTMLElement,
  activationRatio = 0.8,
): boolean {
  const rect =
    element.getBoundingClientRect();

  const activationLine =
    window.innerHeight *
    activationRatio;

  if (
    rect.top > activationLine ||
    rect.bottom <= 0
  ) {
    return false;
  }

  const sampleY = Math.min(
    Math.max(
      rect.top + 24,
      0,
    ),
    window.innerHeight - 1,
  );

  const sampleXs = [
    window.innerWidth * 0.25,
    window.innerWidth * 0.5,
    window.innerWidth * 0.75,
  ];

  return sampleXs.some((x) => {
    const topElement =
      document.elementFromPoint(
        x,
        sampleY,
      );

    return Boolean(
      topElement &&
        (
          topElement ===
            element ||
          element.contains(
            topElement,
          )
        )
    );
  });
}

/* ============================================================
   MARQUEES
   Mantiene la lógica original:
   pausa cuando salen del viewport.
   ============================================================ */

function initMarquees(
  section: HTMLElement,
) {
  const marquees =
    section.querySelectorAll<HTMLElement>(
      ".marquee__track",
    );

  if (!marquees.length) {
    return () => {};
  }

  const observer =
    new IntersectionObserver(
      (entries) => {
        for (
          const entry of entries
        ) {
          const track =
            entry.target as HTMLElement;

          track.classList.toggle(
            "is-out-of-view",
            !entry.isIntersecting,
          );
        }
      },
      {
        threshold: 0,
      },
    );

  marquees.forEach(
    (track) => {
      observer.observe(track);
    },
  );

  return () => {
    observer.disconnect();

    marquees.forEach(
      (track) => {
        track.classList.remove(
          "is-out-of-view",
        );
      },
    );
  };
}

/* ============================================================
   ANIMACIÓN DE ENTRADA — REPLAY
   ============================================================ */

function initEntryAnimation(
  section: HTMLElement,
) {
  const counter =
    section.querySelector<HTMLElement>(
      ".clientes-counter",
    );

  const title =
    section.querySelector<HTMLElement>(
      ".clientes-title",
    );

  const marquees = Array.from(
    section.querySelectorAll<HTMLElement>(
      ".marquee",
    ),
  );

  const firstMarquee =
    marquees[0] ?? null;

  const secondMarquee =
    marquees[1] ?? null;

  const prefersReducedMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

  if (prefersReducedMotion) {
    return () => {};
  }

  /* ==========================================================
     ESTADO INICIAL

     IMPORTANTE:
     NO tocamos .marquee__track.
     Solo los wrappers .marquee.
     ========================================================== */

  const setInitialState =
    (): void => {
      if (counter) {
        gsap.set(counter, {
          autoAlpha: 0,
          y: 18,
        });
      }

      if (title) {
        gsap.set(title, {
          autoAlpha: 0,
          y: 28,
          scale: 0.96,

          transformOrigin:
            "center center",
        });
      }

      if (firstMarquee) {
        gsap.set(
          firstMarquee,
          {
            autoAlpha: 0,
            x: 80,
          },
        );
      }

      if (secondMarquee) {
        gsap.set(
          secondMarquee,
          {
            autoAlpha: 0,
            x: -80,
          },
        );
      }
    };

  setInitialState();

  /* ==========================================================
     TIMELINE
     ========================================================== */

  const timeline =
    gsap.timeline({
      paused: true,
    });

  if (counter) {
    timeline.to(counter, {
      autoAlpha: 1,
      y: 0,

      duration: 0.65,

      ease: "power3.out",
    });
  }

  if (title) {
    timeline.to(
      title,
      {
        autoAlpha: 1,
        y: 0,
        scale: 1,

        duration: 1,

        ease: "power3.out",
      },
      counter
        ? "-=0.25"
        : 0,
    );
  }

  if (firstMarquee) {
    timeline.to(
      firstMarquee,
      {
        autoAlpha: 1,
        x: 0,

        duration: 1,

        ease: "power3.out",
      },
      "-=0.35",
    );
  }

  if (secondMarquee) {
    timeline.to(
      secondMarquee,
      {
        autoAlpha: 1,
        x: 0,

        duration: 1,

        ease: "power3.out",
      },
      "-=0.65",
    );
  }

  /* ==========================================================
     ESTADO DEL REPLAY
     ========================================================== */

  let hasPlayed = false;

  let isArmedForReplay = true;

  let checkFrame = 0;

  /* ==========================================================
     PLAY
     ========================================================== */

  const playClients =
    (): void => {
      if (
        !isArmedForReplay
      ) {
        return;
      }

      if (
        !isElementActuallyVisible(
          section,
          0.82,
        )
      ) {
        return;
      }

      isArmedForReplay =
        false;

      hasPlayed = true;

      /*
       * Reconstruimos únicamente
       * los wrappers visuales de
       * la entrada.
       */
      setInitialState();

      timeline.restart();
    };

  /* ==========================================================
     RESET
     ========================================================== */

  const resetClients =
    (): void => {
      if (!hasPlayed) {
        return;
      }

      if (
        isArmedForReplay
      ) {
        return;
      }

      hasPlayed = false;

      isArmedForReplay =
        true;

      /*
       * La timeline sigue existiendo,
       * solo vuelve al inicio.
       */
      timeline.pause(0);

      /*
       * Nunca tocamos los tracks.
       */
      setInitialState();
    };

  /* ==========================================================
     CHECK DE POSICIÓN
     ========================================================== */

  const checkPosition =
    (): void => {
      const rect =
        section.getBoundingClientRect();

      const viewportHeight =
        window.innerHeight;

      /*
       * Salimos hacia abajo:
       * Clients quedó arriba.
       */
      const leftThroughTop =
        rect.bottom <=
        viewportHeight * 0.05;

      /*
       * Salimos hacia arriba:
       * Clients quedó debajo.
       */
      const leftThroughBottom =
        rect.top >=
        viewportHeight * 0.95;

      if (
        leftThroughTop ||
        leftThroughBottom
      ) {
        resetClients();

        return;
      }

      /* =====================================
         ALTURA REAL VISIBLE
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

      const minimumVisible =
        Math.min(
          100,
          viewportHeight *
            0.1,
        );

      const isVisibleEnough =
        visibleHeight >=
        minimumVisible;

      const reachedActivationZone =
        rect.top <
          viewportHeight *
            0.82 &&
        rect.bottom >
          viewportHeight *
            0.05;

      if (
        !isVisibleEnough ||
        !reachedActivationZone
      ) {
        return;
      }

      playClients();
    };

  /* ==========================================================
     RAF THROTTLE
     ========================================================== */

  const scheduleCheck =
    (): void => {
      if (checkFrame) {
        return;
      }

      checkFrame =
        requestAnimationFrame(
          () => {
            checkFrame = 0;

            checkPosition();
          },
        );
    };

  /* ==========================================================
     OBSERVER
     ========================================================== */

  const observer =
    new IntersectionObserver(
      () => {
        scheduleCheck();
      },
      {
        root: null,

        threshold: [
          0,
          0.05,
          0.1,
          0.2,
        ],

        rootMargin:
          "0px 0px -15% 0px",
      },
    );

  observer.observe(section);

  /*
   * Estos listeners permanecen
   * activos para poder rearmar
   * la animación al salir y volver.
   */

  window.addEventListener(
    "scroll",
    scheduleCheck,
    {
      passive: true,
    },
  );

  window.addEventListener(
    "resize",
    scheduleCheck,
    {
      passive: true,
    },
  );

  requestAnimationFrame(
    scheduleCheck,
  );

  /* ==========================================================
     CLEANUP
     ========================================================== */

  return () => {
    observer.disconnect();

    window.removeEventListener(
      "scroll",
      scheduleCheck,
    );

    window.removeEventListener(
      "resize",
      scheduleCheck,
    );

    if (checkFrame) {
      cancelAnimationFrame(
        checkFrame,
      );

      checkFrame = 0;
    }

    timeline.kill();
  };
}

/* ============================================================
   INIT
   ============================================================ */

function initClients() {
  cleanupCurrentPage?.();

  cleanupCurrentPage = null;

  const section =
    document.querySelector<HTMLElement>(
      "#clientes",
    );

  if (!section) {
    return;
  }

  /*
   * Las marquesinas continúan
   * funcionando de manera
   * totalmente independiente.
   */
  const removeMarquees =
    initMarquees(section);

  /*
   * GSAP anima únicamente:
   *
   * - contador
   * - título
   * - wrappers .marquee
   *
   * Nunca .marquee__track.
   */
  const removeEntry =
    initEntryAnimation(
      section,
    );

  cleanupCurrentPage =
    () => {
      removeEntry();

      removeMarquees();
    };
}

/* ============================================================
   ARRANQUE
   ============================================================ */

initClients();

export {};