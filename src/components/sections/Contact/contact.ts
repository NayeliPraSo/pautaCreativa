/**
 * Contact — animaciones y lógica
 *
 * - Entrada inicial por visibilidad real.
 * - Texto con efecto máquina de escribir.
 * - Botones aparecen uno por uno.
 * - Transición suave entre vista inicial y formulario.
 * - El título NO usa Flip.
 * - El título NO conserva transforms inline.
 * - El CSS mantiene el control total de su posición/rotación responsive.
 * - Campos del formulario aparecen progresivamente.
 * - Conserva la lógica original de formularios y archivos.
 */

import gsap from "gsap";
import { Flip } from "gsap/Flip";

gsap.registerPlugin(Flip);

/* ============================================================
   ESTADO GLOBAL / CLEANUP
   ============================================================ */

let cleanupCurrentContact: (() => void) | null = null;

/* ============================================================
   VISIBILIDAD REAL
   ============================================================ */

function isActuallyVisible(
  element: HTMLElement,
  activationRatio = 0.82,
): boolean {
  const rect = element.getBoundingClientRect();

  const activationLine =
    window.innerHeight * activationRatio;

  if (rect.top > activationLine || rect.bottom <= 0) {
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
      document.elementFromPoint(x, sampleY);

    return Boolean(
      topElement &&
        (
          topElement === element ||
          element.contains(topElement)
        ),
    );
  });
}

/* ============================================================
   MÁQUINA DE ESCRIBIR
   ============================================================ */

function splitIntoTypewriterLetters(
  element: HTMLElement,
): HTMLElement[] {
  if (element.dataset.typewriterReady === "true") {
    return Array.from(
      element.querySelectorAll<HTMLElement>(
        ".contact-type-letter",
      ),
    );
  }

  const text =
    element.textContent?.trim() ?? "";

  if (!text) return [];

  element.textContent = "";

  const words = text.split(/\s+/);

  const letters: HTMLElement[] = [];

  words.forEach((word, wordIndex) => {
    const wordSpan =
      document.createElement("span");

    wordSpan.className =
      "contact-type-word";

    wordSpan.style.display =
      "inline-block";

    Array.from(word).forEach((character) => {
      const letter =
        document.createElement("span");

      letter.className =
        "contact-type-letter";

      letter.textContent =
        character;

      letter.style.display =
        "inline-block";

      wordSpan.appendChild(letter);

      letters.push(letter);
    });

    element.appendChild(wordSpan);

    if (wordIndex < words.length - 1) {
      element.appendChild(
        document.createTextNode(" "),
      );
    }
  });

  element.dataset.typewriterReady =
    "true";

  return letters;
}

/* ============================================================
   INIT
   ============================================================ */

function initContact() {
  cleanupCurrentContact?.();
  cleanupCurrentContact = null;

  const contactElement =
    document.querySelector<HTMLElement>(
      "#contact",
    );

  if (!contactElement) return;

  /*
   * Desde aquí `contact` es HTMLElement,
   * nunca null.
   */
  const contact = contactElement;

  const prefersReducedMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

  /* ==========================================================
     ELEMENTOS
     ========================================================== */

  const label =
    contact.querySelector<HTMLElement>(
      ".contact-label",
    );

  const titleImage =
    contact.querySelector<HTMLImageElement>(
      "[data-contact-title]",
    );

  const descriptionRow =
    contact.querySelector<HTMLElement>(
      ".contact-description-row",
    );

  const description =
    contact.querySelector<HTMLElement>(
      ".contact-description",
    );

  const decoration =
    contact.querySelector<HTMLElement>(
      ".contact-decoration",
    );

  const selector =
    contact.querySelector<HTMLElement>(
      ".contact-selector",
    );

  const buttons =
    Array.from(
      contact.querySelectorAll<HTMLButtonElement>(
        "[data-form]",
      ),
    );

  const panels =
    Array.from(
      contact.querySelectorAll<HTMLElement>(
        "[data-form-panel]",
      ),
    );

  const formWrapper =
    contact.querySelector<HTMLElement>(
      "[data-contact-form]",
    );

  const fileInputs =
    Array.from(
      contact.querySelectorAll<HTMLInputElement>(
        'input[type="file"]',
      ),
    );

  const controller =
    new AbortController();

  const { signal } =
    controller;

  /* ==========================================================
     TÍTULOS
     ========================================================== */

  const defaultTitle =
    formWrapper?.dataset.defaultTitle ?? "";

  const titleImages: Record<
    string,
    string | undefined
  > = {
    clientes:
      formWrapper?.dataset.titleClientes,

    trabajo:
      formWrapper?.dataset.titleTrabajo,

    proveedores:
      formWrapper?.dataset.titleProveedores,
  };

  /* ==========================================================
     HELPERS
     ========================================================== */

  function getActivePanel(
    formType: string,
  ): HTMLElement | null {
    return (
      panels.find(
        (panel) =>
          panel.dataset.formPanel === formType,
      ) ?? null
    );
  }

  function hideAllPanels() {
    panels.forEach((panel) => {
      panel.hidden = true;
    });
  }

  function activateButton(
    activeButton:
      | HTMLButtonElement
      | null,
  ) {
    buttons.forEach((button) => {
      button.classList.toggle(
        "is-active",
        button === activeButton,
      );
    });
  }

  /*
   * Solo incluimos en Flip elementos
   * realmente visibles.
   *
   * Esto evita intentar animar decoration
   * cuando en móvil está display:none.
   */
  function getFlipElements(): HTMLElement[] {
    return [
      descriptionRow,
      selector,
      decoration,
    ].filter(
      (
        element,
      ): element is HTMLElement =>
        Boolean(
          element &&
            window.getComputedStyle(element)
              .display !== "none",
        ),
    );
  }

  /* ==========================================================
     ANIMACIÓN DE CAMPOS
     ========================================================== */

  function animateFormFields(
    panel: HTMLElement,
  ) {
    if (prefersReducedMotion) return;

    const fields =
      Array.from(
        panel.querySelectorAll<HTMLElement>(
          ".contact-field",
        ),
      );

    const privacy =
      panel.querySelector<HTMLElement>(
        ".contact-privacy",
      );

    const submit =
      panel.querySelector<HTMLElement>(
        ".contact-submit",
      );

    const elements: HTMLElement[] = [
      ...fields,
    ];

    if (privacy) {
      elements.push(privacy);
    }

    if (submit) {
      elements.push(submit);
    }

    gsap.killTweensOf(elements);

    gsap.fromTo(
      elements,
      {
        autoAlpha: 0,
        y: 14,
      },
      {
        autoAlpha: 1,
        y: 0,

        duration: 0.48,

        stagger: 0.065,

        ease: "power2.out",

        clearProps:
          "opacity,visibility,transform",
      },
    );
  }

  /* ==========================================================
     CAMBIO ENTRE FORMULARIOS
     YA ESTANDO EN VISTA 2
     ========================================================== */

  function switchForm(
    formType: string,
    activeButton: HTMLButtonElement,
  ) {
    const newPanel =
      getActivePanel(formType);

    if (!newPanel) return;

    const currentPanel =
      panels.find(
        (panel) => !panel.hidden,
      );

    activateButton(activeButton);

    const imageSrc =
      titleImages[formType];

    if (prefersReducedMotion) {
      hideAllPanels();

      newPanel.hidden = false;

      if (
        titleImage &&
        imageSrc
      ) {
        titleImage.src =
          imageSrc;

        /*
         * Nunca dejamos transform inline.
         */
        gsap.set(titleImage, {
          clearProps: "transform",
        });
      }

      return;
    }

    if (
      !currentPanel ||
      currentPanel === newPanel
    ) {
      hideAllPanels();

      newPanel.hidden = false;

      if (
        titleImage &&
        imageSrc
      ) {
        titleImage.src =
          imageSrc;

        gsap.set(titleImage, {
          clearProps: "transform",
        });
      }

      animateFormFields(
        newPanel,
      );

      return;
    }

    gsap.killTweensOf(
      currentPanel,
    );

    gsap.to(
      currentPanel,
      {
        autoAlpha: 0,
        y: 8,

        duration: 0.25,

        ease: "power2.in",

        onComplete: () => {
          hideAllPanels();

          newPanel.hidden =
            false;

          gsap.set(
            newPanel,
            {
              autoAlpha: 1,
              y: 0,
            },
          );

          /* --------------------------------------------
             Cambio de título SIN Flip
             -------------------------------------------- */

          if (
            titleImage &&
            imageSrc
          ) {
            gsap.killTweensOf(
              titleImage,
            );

            gsap.to(
              titleImage,
              {
                autoAlpha: 0,

                duration: 0.22,

                ease: "power2.in",

                onComplete: () => {
                  titleImage.src =
                    imageSrc;

                  /*
                   * Dejamos el transform completamente
                   * en manos del CSS.
                   */
                  gsap.set(
                    titleImage,
                    {
                      clearProps:
                        "transform",
                    },
                  );

                  gsap.fromTo(
                    titleImage,
                    {
                      autoAlpha: 0,
                    },
                    {
                      autoAlpha: 1,

                      duration: 0.35,

                      ease:
                        "power2.out",

                      clearProps:
                        "opacity,visibility,transform",
                    },
                  );
                },
              },
            );
          }

          animateFormFields(
            newPanel,
          );
        },
      },
    );
  }

  /* ==========================================================
     ABRIR FORMULARIO
     ========================================================== */

  function openForm(
    formType: string,
    activeButton: HTMLButtonElement,
  ) {
    /*
     * Si la Vista 2 ya está abierta,
     * únicamente cambiamos formulario.
     */
    if (
      contact.classList.contains(
        "is-form-open",
      )
    ) {
      switchForm(
        formType,
        activeButton,
      );

      return;
    }

    const panel =
      getActivePanel(formType);

    if (!panel) return;

    const imageSrc =
      titleImages[formType];

    /*
     * El título NO forma parte de Flip.
     */
    const flipElements =
      getFlipElements();

    const state =
      Flip.getState(
        flipElements,
        {
          props:
            "opacity,visibility",
        },
      );

    /* --------------------------------------------------------
       Título sale antes del cambio
       -------------------------------------------------------- */

    if (
      titleImage &&
      !prefersReducedMotion
    ) {
      gsap.killTweensOf(
        titleImage,
      );

      /*
       * Muy importante:
       * NO usamos y ni scale aquí.
       * Solo opacity.
       */
      gsap.to(
        titleImage,
        {
          autoAlpha: 0,

          duration: 0.25,

          ease: "power2.in",
        },
      );
    }

    /* --------------------------------------------------------
       CSS calcula la Vista 2
       -------------------------------------------------------- */

    contact.classList.add(
      "is-form-open",
    );

    activateButton(
      activeButton,
    );

    hideAllPanels();

    panel.hidden = false;

    if (
      titleImage &&
      imageSrc
    ) {
      titleImage.src =
        imageSrc;

      /*
       * Fundamental en móvil:
       * eliminamos cualquier transform inline anterior
       * para que vuelva a funcionar:
       *
       * transform: rotate(90deg);
       *
       * definido por CSS.
       */
      gsap.set(
        titleImage,
        {
          clearProps:
            "transform",
        },
      );

      if (!prefersReducedMotion) {
        gsap.set(
          titleImage,
          {
            autoAlpha: 0,
          },
        );
      }
    }

    /* --------------------------------------------------------
       Campos ocultos durante transición
       -------------------------------------------------------- */

    if (!prefersReducedMotion) {
      const formElements =
        panel.querySelectorAll<HTMLElement>(
          [
            ".contact-field",
            ".contact-privacy",
            ".contact-submit",
          ].join(","),
        );

      gsap.set(
        formElements,
        {
          autoAlpha: 0,
          y: 14,
        },
      );
    }

    if (prefersReducedMotion) {
      return;
    }

    /* --------------------------------------------------------
       Movimiento de layout
       -------------------------------------------------------- */

    Flip.from(
      state,
      {
        duration: 1.2,

        ease:
          "power3.inOut",

        absolute: true,

        nested: true,

        prune: true,

        onComplete: () => {
          /*
           * Antes de mostrar título:
           * aseguramos nuevamente que el CSS
           * controle su transform.
           */
          if (titleImage) {
            gsap.set(
              titleImage,
              {
                clearProps:
                  "transform",
              },
            );

            gsap.fromTo(
              titleImage,
              {
                autoAlpha: 0,
              },
              {
                autoAlpha: 1,

                duration: 0.45,

                ease:
                  "power2.out",

                clearProps:
                  "opacity,visibility,transform",
              },
            );
          }

          animateFormFields(
            panel,
          );
        },
      },
    );
  }

  /* ==========================================================
     CERRAR FORMULARIO
     ========================================================== */

  function closeForms(
    animate = true,
  ) {
    const wasOpen =
      contact.classList.contains(
        "is-form-open",
      );

    /*
     * Estado inicial o reduced motion.
     */
    if (
      !wasOpen ||
      !animate ||
      prefersReducedMotion
    ) {
      contact.classList.remove(
        "is-form-open",
      );

      activateButton(null);

      hideAllPanels();

      if (
        titleImage &&
        defaultTitle
      ) {
        titleImage.src =
          defaultTitle;

        titleImage.alt =
          "Cuéntanos tu reto";

        /*
         * Devolvemos siempre transform al CSS.
         */
        gsap.set(
          titleImage,
          {
            clearProps:
              "transform,opacity,visibility",
          },
        );
      }

      return;
    }

    const currentPanel =
      panels.find(
        (panel) => !panel.hidden,
      );

    const flipElements =
      getFlipElements();

    /* --------------------------------------------------------
       Vista 2 -> Vista 1
       -------------------------------------------------------- */

    const performFlipBack =
      () => {
        const state =
          Flip.getState(
            flipElements,
            {
              props:
                "opacity,visibility",
            },
          );

        /*
         * El CSS vuelve a Vista 1.
         */
        contact.classList.remove(
          "is-form-open",
        );

        activateButton(null);

        hideAllPanels();

        if (
          titleImage &&
          defaultTitle
        ) {
          titleImage.src =
            defaultTitle;

          titleImage.alt =
            "Cuéntanos tu reto";

          /*
           * Quitamos cualquier transformación de GSAP
           * antes de que el navegador aplique
           * nuevamente el layout normal.
           */
          gsap.set(
            titleImage,
            {
              clearProps:
                "transform",
            },
          );

          gsap.set(
            titleImage,
            {
              autoAlpha: 0,
            },
          );
        }

        Flip.from(
          state,
          {
            duration: 1.2,

            ease:
              "power3.inOut",

            absolute: true,

            nested: true,

            prune: true,

            onComplete: () => {
              if (titleImage) {
                /*
                 * CSS recupera control total.
                 */
                gsap.set(
                  titleImage,
                  {
                    clearProps:
                      "transform",
                  },
                );

                gsap.fromTo(
                  titleImage,
                  {
                    autoAlpha: 0,
                  },
                  {
                    autoAlpha: 1,

                    duration: 0.45,

                    ease:
                      "power2.out",

                    clearProps:
                      "opacity,visibility,transform",
                  },
                );
              }
            },
          },
        );
      };

    /* --------------------------------------------------------
       Primero sale el formulario
       -------------------------------------------------------- */

    const hidePanelThenContinue =
      () => {
        /*
         * Después sale el título.
         *
         * SOLO opacity.
         * No y.
         * No scale.
         * No transform.
         */
        if (titleImage) {
          gsap.killTweensOf(
            titleImage,
          );

          gsap.to(
            titleImage,
            {
              autoAlpha: 0,

              duration: 0.25,

              ease: "power2.in",

              onComplete:
                performFlipBack,
            },
          );

          return;
        }

        performFlipBack();
      };

    if (currentPanel) {
      gsap.to(
        currentPanel,
        {
          autoAlpha: 0,
          y: 8,

          duration: 0.25,

          ease: "power2.in",

          onComplete: () => {
            gsap.set(
              currentPanel,
              {
                clearProps:
                  "opacity,visibility,transform",
              },
            );

            hidePanelThenContinue();
          },
        },
      );

      return;
    }

    hidePanelThenContinue();
  }

  /* ==========================================================
     BOTONES
     ========================================================== */

  buttons.forEach((button) => {
    button.addEventListener(
      "click",
      () => {
        const formType =
          button.dataset.form;

        if (!formType) return;

        const isActive =
          button.classList.contains(
            "is-active",
          );

        if (isActive) {
          closeForms(true);

          return;
        }

        openForm(
          formType,
          button,
        );
      },
      {
        signal,
      },
    );
  });

  /* ==========================================================
     INPUTS DE ARCHIVO
     ========================================================== */

  fileInputs.forEach((input) => {
    const fileName =
      input
        .closest(".contact-file")
        ?.querySelector<HTMLElement>(
          ".contact-file-name",
        );

    if (!fileName) return;

    input.addEventListener(
      "change",
      () => {
        const file =
          input.files?.[0];

        fileName.textContent =
          file
            ? file.name
            : "Ningún archivo seleccionado";
      },
      {
        signal,
      },
    );
  });

  /* ==========================================================
     ESTADO INICIAL
     ========================================================== */

  closeForms(false);

  /* ==========================================================
     ANIMACIÓN DE ENTRADA
     ========================================================== */

  if (prefersReducedMotion) {
    cleanupCurrentContact =
      () => {
        controller.abort();
      };

    return;
  }

  const letters =
    description
      ? splitIntoTypewriterLetters(
          description,
        )
      : [];

  /* ----------------------------------------------------------
     Estados iniciales
     ---------------------------------------------------------- */

  if (label) {
    gsap.set(
      label,
      {
        autoAlpha: 0,
        y: 16,
      },
    );
  }

  /*
   * IMPORTANTE:
   *
   * Quitamos scale.
   *
   * Solo usamos y para la entrada,
   * y al terminar limpiamos transform.
   */
  if (titleImage) {
    gsap.set(
      titleImage,
      {
        autoAlpha: 0,
        y: 28,
      },
    );
  }

  if (letters.length) {
    gsap.set(
      letters,
      {
        autoAlpha: 0,
      },
    );
  }

  if (decoration) {
    gsap.set(
      decoration,
      {
        autoAlpha: 0,
        scale: 0.9,

        transformOrigin:
          "center center",
      },
    );
  }

  if (buttons.length) {
    gsap.set(
      buttons,
      {
        autoAlpha: 0,
        y: 18,
        scale: 0.96,

        transformOrigin:
          "center center",
      },
    );
  }

  /* ----------------------------------------------------------
     Timeline entrada
     ---------------------------------------------------------- */

  const entryTimeline =
    gsap.timeline({
      paused: true,
    });

  if (label) {
    entryTimeline.to(
      label,
      {
        autoAlpha: 1,
        y: 0,

        duration: 0.65,

        ease: "power3.out",
      },
    );
  }

  if (titleImage) {
    entryTimeline.to(
      titleImage,
      {
        autoAlpha: 1,
        y: 0,

        duration: 0.95,

        ease: "power3.out",
      },
      label
        ? "-=0.25"
        : 0,
    );

    /*
     * ESTA ES LA CORRECCIÓN PRINCIPAL.
     *
     * GSAP utilizó transform para mover `y`,
     * pero inmediatamente después lo eliminamos.
     *
     * Así posteriormente tu media query puede aplicar:
     *
     * transform: rotate(90deg);
     */
    entryTimeline.set(
      titleImage,
      {
        clearProps:
          "transform",
      },
    );
  }

  /*
   * Máquina de escribir
   */
  if (letters.length) {
    entryTimeline.to(
      letters,
      {
        autoAlpha: 1,

        duration: 0.01,

        stagger: 0.025,

        ease: "none",
      },
      "-=0.15",
    );
  }

  /*
   * Plus
   */
  if (decoration) {
    entryTimeline.to(
      decoration,
      {
        autoAlpha: 1,

        scale: 1,

        duration: 0.55,

        ease:
          "back.out(1.5)",

        /*
         * También podemos devolver transform
         * al CSS al terminar.
         */
        clearProps:
          "transform",
      },
      "-=0.2",
    );
  }

  /*
   * Clientes
   * Bolsa de trabajo
   * Proveedores
   */
  if (buttons.length) {
    entryTimeline.to(
      buttons,
      {
        autoAlpha: 1,

        y: 0,

        scale: 1,

        duration: 0.55,

        stagger: 0.18,

        ease: "power3.out",

        clearProps:
          "transform",
      },
      "-=0.1",
    );
  }

  /* ==========================================================
     TRIGGER VISIBILIDAD REAL
     ========================================================== */

  let hasPlayed =
    false;

  const tryPlayEntry =
    () => {
      if (hasPlayed) return;

      if (
        !isActuallyVisible(
          contact,
          0.82,
        )
      ) {
        return;
      }

      hasPlayed = true;

      entryObserver.disconnect();

      window.removeEventListener(
        "scroll",
        tryPlayEntry,
      );

      window.removeEventListener(
        "resize",
        tryPlayEntry,
      );

      entryTimeline.play(0);
    };

  const entryObserver =
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

        tryPlayEntry();
      },
      {
        threshold: 0.08,

        rootMargin:
          "0px 0px -12% 0px",
      },
    );

  entryObserver.observe(
    contact,
  );

  window.addEventListener(
    "scroll",
    tryPlayEntry,
    {
      passive: true,
      signal,
    },
  );

  window.addEventListener(
    "resize",
    tryPlayEntry,
    {
      passive: true,
      signal,
    },
  );

  /* ==========================================================
     CLEANUP
     ========================================================== */

  cleanupCurrentContact =
    () => {
      controller.abort();

      entryObserver.disconnect();

      entryTimeline.kill();

      Flip.killFlipsOf(
        getFlipElements(),
      );

      if (label) {
        gsap.killTweensOf(
          label,
        );
      }

      if (titleImage) {
        gsap.killTweensOf(
          titleImage,
        );

        /*
         * Por seguridad, nunca dejamos
         * transform inline al destruir.
         */
        gsap.set(
          titleImage,
          {
            clearProps:
              "transform",
          },
        );
      }

      if (description) {
        gsap.killTweensOf(
          description,
        );
      }

      if (descriptionRow) {
        gsap.killTweensOf(
          descriptionRow,
        );
      }

      if (decoration) {
        gsap.killTweensOf(
          decoration,
        );
      }

      if (selector) {
        gsap.killTweensOf(
          selector,
        );
      }

      gsap.killTweensOf(
        buttons,
      );

      gsap.killTweensOf(
        panels,
      );
    };
}

/* ============================================================
   ARRANQUE ASTRO
   ============================================================ */

initContact();

document.addEventListener(
  "astro:page-load",
  initContact,
);

export {};