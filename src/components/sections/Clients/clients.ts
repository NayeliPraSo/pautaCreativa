/**
 * Clients — animaciones y lógica
 * Toda la interacción/animación de esta sección vive aquí.
 */

import gsap from "gsap";

/* ============================================================
   ESTADO / CLEANUP
   ============================================================ */

let cleanupCurrentPage: (() => void) | null = null;

/* ============================================================
   UTILIDAD:
   comprueba que la sección esté realmente visible
   ============================================================ */

function isElementActuallyVisible(
  element: HTMLElement,
  activationRatio = 0.8,
): boolean {
  const rect = element.getBoundingClientRect();

  const activationLine =
    window.innerHeight * activationRatio;

  if (
    rect.top > activationLine ||
    rect.bottom <= 0
  ) {
    return false;
  }

  const sampleY = Math.min(
    Math.max(rect.top + 24, 0),
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
          topElement === element ||
          element.contains(topElement)
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
        for (const entry of entries) {
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

  marquees.forEach((track) => {
    observer.observe(track);
  });

  return () => {
    observer.disconnect();

    marquees.forEach((track) => {
      track.classList.remove(
        "is-out-of-view",
      );
    });
  };
}

/* ============================================================
   ANIMACIÓN DE ENTRADA
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

  /* ----------------------------------------------------------
     Estados iniciales
     IMPORTANTE:
     no tocamos .marquee__track porque ahí vive
     la animación CSS infinita.
     ---------------------------------------------------------- */

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
    gsap.set(firstMarquee, {
      autoAlpha: 0,
      x: 80,
    });
  }

  if (secondMarquee) {
    gsap.set(secondMarquee, {
      autoAlpha: 0,
      x: -80,
    });
  }

  /* ----------------------------------------------------------
     Timeline pausada
     ---------------------------------------------------------- */

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
      counter ? "-=0.25" : 0,
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

  /* ----------------------------------------------------------
     Disparo por visibilidad real
     ---------------------------------------------------------- */

  let hasPlayed = false;

  const tryPlay = () => {
    if (hasPlayed) return;

    if (
      !isElementActuallyVisible(
        section,
        0.82,
      )
    ) {
      return;
    }

    hasPlayed = true;

    observer.disconnect();

    window.removeEventListener(
      "scroll",
      tryPlay,
    );

    window.removeEventListener(
      "resize",
      tryPlay,
    );

    timeline.play(0);
  };

  const observer =
    new IntersectionObserver(
      (entries) => {
        const entry =
          entries[0];

        if (
          !entry?.isIntersecting ||
          hasPlayed
        ) {
          return;
        }

        tryPlay();
      },
      {
        root: null,

        threshold: 0.08,

        rootMargin:
          "0px 0px -15% 0px",
      },
    );

  observer.observe(section);

  /*
   * El listener de scroll es intencional:
   * si alguna sección pinned está visualmente
   * por encima, volvemos a comprobar la
   * visibilidad real al seguir desplazándonos.
   */
  window.addEventListener(
    "scroll",
    tryPlay,
    {
      passive: true,
    },
  );

  window.addEventListener(
    "resize",
    tryPlay,
    {
      passive: true,
    },
  );

  return () => {
    observer.disconnect();

    window.removeEventListener(
      "scroll",
      tryPlay,
    );

    window.removeEventListener(
      "resize",
      tryPlay,
    );

    timeline.kill();

    if (counter) {
      gsap.killTweensOf(counter);
    }

    if (title) {
      gsap.killTweensOf(title);
    }

    if (firstMarquee) {
      gsap.killTweensOf(
        firstMarquee,
      );
    }

    if (secondMarquee) {
      gsap.killTweensOf(
        secondMarquee,
      );
    }
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

  if (!section) return;

  /*
   * La lógica original de las marquesinas
   * sigue funcionando de forma independiente.
   */
  const removeMarquees =
    initMarquees(section);

  /*
   * GSAP únicamente anima:
   * - contador
   * - título
   * - contenedores .marquee
   *
   * Nunca los .marquee__track.
   */
  const removeEntry =
    initEntryAnimation(section);

  cleanupCurrentPage = () => {
    removeEntry();
    removeMarquees();
  };
}

/* ============================================================
   ARRANQUE
   ============================================================ */

initClients();

document.addEventListener(
  "astro:page-load",
  initClients,
);

export {};