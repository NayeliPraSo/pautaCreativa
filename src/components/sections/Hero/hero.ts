/**
 * Hero — animaciones
 * Toda animación del Hero vive aquí.
 */

import gsap from "gsap";

/* ============================================================
   HERO
   ============================================================ */

const hero =
  document.querySelector<HTMLElement>("#hero");

if (hero) {
  const prefersReducedMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

  const heroBg =
    hero.querySelector<HTMLElement>(".hero-bg");

  const index =
    hero.querySelector<HTMLElement>(".hero-index");

  const titleSmall =
    hero.querySelector<HTMLElement>(
      ".hero-title-small"
    );

  const titleMain =
    hero.querySelector<HTMLElement>(
      ".hero-title-main"
    );

  const subtitle =
    hero.querySelector<HTMLElement>(
      ".hero-subtitle"
    );

  const plusGroups =
    hero.querySelectorAll<HTMLElement>(
      ".hero-plus-group"
    );

  const plusIcons =
    hero.querySelectorAll<HTMLElement>(
      ".hero-plus"
    );

  const scroll =
    hero.querySelector<HTMLElement>(
      ".hero-scroll"
    );

  /* ============================================================
     REDUCED MOTION
     ============================================================ */

  if (!prefersReducedMotion) {
    /* ============================================================
       MÁQUINA DE ESCRIBIR
       ============================================================ */

    const splitTextIntoLetters = (
      element: HTMLElement | null
    ): HTMLElement[] => {
      if (!element) return [];

      /*
       * Si ya fue dividido, reutilizamos
       * las letras existentes.
       */
      if (element.dataset.split === "true") {
        return Array.from(
          element.querySelectorAll<HTMLElement>(
            ".hero-letter"
          )
        );
      }

      const text =
        element.textContent ?? "";

      element.setAttribute(
        "aria-label",
        text
      );

      element.textContent = "";

      const letters: HTMLSpanElement[] = [];

      [...text].forEach((character) => {
        const span =
          document.createElement("span");

        span.classList.add("hero-letter");

        span.setAttribute(
          "aria-hidden",
          "true"
        );

        if (character === " ") {
          span.innerHTML = "&nbsp;";
        } else {
          span.textContent = character;
        }

        element.appendChild(span);

        letters.push(span);
      });

      element.dataset.split = "true";

      return letters;
    };

    /* ============================================================
       LETRAS
       ============================================================ */

    const indexLetters =
      splitTextIntoLetters(index);

    const subtitleLetters =
      splitTextIntoLetters(subtitle);

    /* ============================================================
       PLUS — CONFIGURACIÓN
       ============================================================ */

    plusIcons.forEach((plus) => {
      gsap.set(plus, {
        transformOrigin: "50% 50%",
      });

      /*
       * Hover:
       * únicamente modifica rotation.
       *
       * Así no pelea con el pulso,
       * que controla scale + y.
       */
      plus.addEventListener(
        "mouseenter",
        () => {
          gsap.to(plus, {
            rotation: "+=180",
            duration: 0.45,
            ease: "back.out(1.7)",
          });
        }
      );
    });

    /* ============================================================
       ESTADO INICIAL
       ============================================================ */

    gsap.set(indexLetters, {
      autoAlpha: 0,
      y: 15,
    });

    if (titleSmall) {
      gsap.set(titleSmall, {
        autoAlpha: 0,
        y: 30,
      });
    }

    if (titleMain) {
      gsap.set(titleMain, {
        autoAlpha: 0,
        scale: 0.5,
        transformOrigin: "left center",
      });
    }

    gsap.set(subtitleLetters, {
      autoAlpha: 0,
      y: 20,
    });

    gsap.set(plusGroups, {
      autoAlpha: 0,
      y: 16,
    });

    if (scroll) {
      gsap.set(scroll, {
        autoAlpha: 0,
        y: 10,
      });
    }

    if (heroBg) {
      gsap.set(heroBg, {
        scale: 1.28,
        transformOrigin: "50% 50%",
      });
    }

    /* ============================================================
       ANIMACIÓN AMBIENTAL DE LOS PLUS
       ============================================================ */

    const plusPulse =
      gsap.timeline({
        paused: true,
        repeat: -1,
        yoyo: true,
      });

    plusIcons.forEach(
      (plus, index) => {
        plusPulse.fromTo(
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
            immediateRender: false,
          },
          index * 0.2
        );
      }
    );

    /* ============================================================
       TIMELINE DE ENTRADA
       ============================================================ */

    const entranceTl =
      gsap.timeline({
        paused: true,

        defaults: {
          ease: "power3.out",
        },
      });

    /*
     * Fondo.
     *
     * Ahora forma parte de la entrada,
     * por lo que también puede repetirse
     * al volver al Hero.
     */
    if (heroBg) {
      entranceTl.to(
        heroBg,
        {
          scale: 1,
          duration: 3.5,
          ease: "power1.out",
        },
        0
      );
    }

    /* ----------------------------------------------------------
       ÍNDICE
       ---------------------------------------------------------- */

    entranceTl.to(
      indexLetters,
      {
        autoAlpha: 1,
        y: 0,

        duration: 0.4,

        stagger: {
          each: 0.04,
          from: "start",
        },
      },
      0
    );

    /* ----------------------------------------------------------
       SOMOS
       ---------------------------------------------------------- */

    if (titleSmall) {
      entranceTl.to(
        titleSmall,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
        },
        "-=0.2"
      );
    }

    /* ----------------------------------------------------------
       CREADORES DE SOLUCIONES
       ---------------------------------------------------------- */

    if (titleMain) {
      entranceTl.to(
        titleMain,
        {
          autoAlpha: 1,
          scale: 1,
          duration: 1.4,
          ease: "power3.out",
        },
        "-=0.25"
      );
    }

    /* ----------------------------------------------------------
       SUBTÍTULO
       ---------------------------------------------------------- */

    entranceTl.to(
      subtitleLetters,
      {
        autoAlpha: 1,
        y: 0,

        duration: 0.35,

        stagger: {
          each: 0.06,
          from: "start",
        },

        ease: "power3.out",
      },
      "-=0.35"
    );

    /* ----------------------------------------------------------
       PLUS
       ---------------------------------------------------------- */

    entranceTl.to(
      plusGroups,
      {
        autoAlpha: 1,
        y: 0,

        duration: 0.5,

        stagger: {
          each: 0.1,
          from: "start",
        },
      },
      "-=0.15"
    );

    /* ----------------------------------------------------------
       SCROLL
       ---------------------------------------------------------- */

    if (scroll) {
      entranceTl.to(
        scroll,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.5,
        },
        "-=0.2"
      );
    }

    /* ============================================================
       AL TERMINAR LA ENTRADA
       ============================================================ */

    entranceTl.eventCallback(
      "onComplete",
      () => {
        /*
         * Una vez terminada la entrada,
         * comienzan los movimientos permanentes.
         */
        plusPulse.restart();
      }
    );

    /* ============================================================
       CONTROL DE ESTADO
       ============================================================ */

    let hasPlayed = false;

    /*
     * Evita rearmar el Hero apenas cruza
     * unos pocos píxeles.
     *
     * Solo lo hacemos cuando realmente
     * ha salido de pantalla.
     */
    let isArmedForReplay = true;

    /* ============================================================
       PLAY
       ============================================================ */

    const playHero = (): void => {
      if (!isArmedForReplay) return;

      isArmedForReplay = false;
      hasPlayed = true;

      /*
       * Primero detenemos el movimiento
       * ambiental para garantizar que
       * la entrada empiece limpia.
       */
      plusPulse.pause(0);

      entranceTl.restart();
    };

    /* ============================================================
       RESET
       ============================================================ */

    const resetHero = (): void => {
      if (!hasPlayed) return;
      if (isArmedForReplay) return;

      isArmedForReplay = true;
      hasPlayed = false;

      /*
       * Detenemos animaciones ambientales.
       */
      plusPulse.pause(0);

      /*
       * Regresamos la timeline al segundo 0.
       *
       * Como utilizamos gsap.set + .to()
       * en lugar de .from(), el estado
       * inicial es completamente controlado.
       */
      entranceTl.pause(0);
    };

    /* ============================================================
       DETECCIÓN DE VISIBILIDAD
       ============================================================ */

    const checkHeroPosition = (): void => {
      const rect =
        hero.getBoundingClientRect();

      const viewportHeight =
        window.innerHeight;

      /*
       * Hero está completamente por encima
       * de la pantalla.
       *
       * Damos un pequeño margen para evitar
       * resets justo en el límite.
       */
      const completelyAbove =
        rect.bottom < -80;

      /*
       * Por si en algún momento pudiera
       * llegarse al Hero desde arriba.
       */
      const completelyBelow =
        rect.top > viewportHeight + 80;

      if (
        completelyAbove ||
        completelyBelow
      ) {
        resetHero();
        return;
      }

      /*
       * Entrada.
       *
       * Para Hero no necesitamos esperar
       * hasta 75%-80% del viewport porque
       * es la primera sección.
       */
      const isVisible =
        rect.bottom > 0 &&
        rect.top < viewportHeight;

      if (isVisible) {
        playHero();
      }
    };

    /* ============================================================
       LISTENERS
       ============================================================ */

    window.addEventListener(
      "scroll",
      checkHeroPosition,
      {
        passive: true,
      }
    );

    window.addEventListener(
      "resize",
      checkHeroPosition,
      {
        passive: true,
      }
    );

    /* ============================================================
       PRIMERA CARGA
       ============================================================ */

    requestAnimationFrame(() => {
      checkHeroPosition();
    });
  }
}

export {};