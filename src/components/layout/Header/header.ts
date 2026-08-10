/**
 * Header — comportamiento
 *
 * Encapsula toda la lógica de interacción del header
 * (scroll, menú móvil, etc.).
 *
 * No debe contener estilos ni depender de otras secciones.
 */

const header = document.querySelector<HTMLElement>("[data-header]");

if (header) {
  /* =========================================================
     SCROLL
     ========================================================= */

  const SCROLL_THRESHOLD = 8;

  const onScroll = () => {
    const isScrolled = window.scrollY > SCROLL_THRESHOLD;
    header.classList.toggle("is-scrolled", isScrolled);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();


  /* =========================================================
     MENÚ MÓVIL
     ========================================================= */

  const menuToggle =
    header.querySelector<HTMLButtonElement>("[data-menu-toggle]");

  const menu =
    header.querySelector<HTMLElement>("#header-menu");

  const splash =
    header.querySelector<HTMLElement>("[data-menu-splash]");

  const mobileBrand =
    header.querySelector<HTMLElement>("[data-mobile-brand]");

  if (menuToggle && menu && splash && mobileBrand) {
    const closeMenu = () => {
      menuToggle.classList.remove("is-open");
      menu.classList.remove("is-open");
      splash.classList.remove("is-open");
      mobileBrand.classList.remove("is-hidden");

      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Abrir menú");

      document.body.classList.remove("menu-open");
    };

    const openMenu = () => {
      menuToggle.classList.add("is-open");
      menu.classList.add("is-open");
      splash.classList.add("is-open");
      mobileBrand.classList.add("is-hidden");

      menuToggle.setAttribute("aria-expanded", "true");
      menuToggle.setAttribute("aria-label", "Cerrar menú");

      document.body.classList.add("menu-open");
    };

    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.classList.contains("is-open");

      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });


    /* =======================================================
       CERRAR AL SELECCIONAR UNA OPCIÓN
       ======================================================= */

    const menuLinks =
      menu.querySelectorAll<HTMLAnchorElement>("a");

    menuLinks.forEach((link) => {
      link.addEventListener("click", () => {
        closeMenu();
      });
    });


    /* =======================================================
       ESC PARA CERRAR
       ======================================================= */

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });


    /* =======================================================
       SI CAMBIAMOS A DESKTOP CON EL MENÚ ABIERTO
       ======================================================= */

    const mobileMediaQuery = window.matchMedia(
      "(max-width: 768px)"
    );

    const handleViewportChange = (event: MediaQueryListEvent) => {
      if (!event.matches) {
        closeMenu();
      }
    };

    mobileMediaQuery.addEventListener(
      "change",
      handleViewportChange
    );
  }
}