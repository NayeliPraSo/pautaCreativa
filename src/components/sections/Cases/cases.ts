/**
 * Cases — animaciones y lógica
 * Toda la interacción/animación de esta sección vive aquí.
 */

const grid = document.querySelector<HTMLElement>(".cases-grid");
const detailsContainer =
  document.querySelector<HTMLElement>(".cases-details");

const cards = document.querySelectorAll<HTMLButtonElement>(".case-card");
const detailWrappers =
  document.querySelectorAll<HTMLElement>(".case-detail-wrapper");

if (grid && detailsContainer) {
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      const caseId = card.dataset.caseId;

      if (!caseId) return;

      const selectedDetail =
        document.querySelector<HTMLElement>(
          `.case-detail[data-case-id="${caseId}"]`,
        );

      if (!selectedDetail) return;

      const selectedWrapper =
        selectedDetail.closest<HTMLElement>(".case-detail-wrapper");

      if (!selectedWrapper) return;

      // Ocultar grid
      grid.style.display = "none";

      // Mostrar contenedor de detalles
      detailsContainer.style.display = "block";

      // Ocultar todos los detalles + sus botones
      detailWrappers.forEach((wrapper) => {
        wrapper.style.display = "none";
      });

      // Mostrar solamente el caso seleccionado
      selectedWrapper.style.display = "block";
    });
  });

  detailWrappers.forEach((wrapper) => {
    const closeButton =
      wrapper.querySelector<HTMLButtonElement>(
        ".case-detail__close",
      );

    closeButton?.addEventListener("click", () => {
    const videoContainer =
        wrapper.querySelector<HTMLElement>(".case-detail__video");

    if (videoContainer) {
        const originalContent =
        videoContainer.dataset.originalContent;

        if (originalContent) {
        videoContainer.innerHTML = originalContent;
        }
    }

    wrapper.style.display = "none";
    detailsContainer.style.display = "none";
    grid.style.display = "grid";
    });
  });
}

// ==========================================================
// Video
// ==========================================================

const videoContainers =
  document.querySelectorAll<HTMLElement>(
    ".case-detail__video",
  );

videoContainers.forEach((container) => {
  const originalContent = container.innerHTML;

  const playVideo = () => {
    const videoUrl = container.dataset.video;

    if (!videoUrl) return;

    const videoId = getYouTubeVideoId(videoUrl);

    if (!videoId) return;

    const iframe = document.createElement("iframe");

    iframe.className = "case-detail__iframe";

    iframe.src =
      `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;

    iframe.title = "Video del caso";

    iframe.allow =
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";

    iframe.allowFullscreen = true;

    container.innerHTML = "";
    container.appendChild(iframe);
  };

  container.addEventListener("click", playVideo);

  container.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      playVideo();
    }
  });

  container.dataset.originalContent = originalContent;
});


// ==========================================================
// Obtener ID de YouTube
// ==========================================================

function getYouTubeVideoId(url: string): string | null {
  try {
    const parsedUrl = new URL(url);

    if (
      parsedUrl.hostname === "www.youtube.com" ||
      parsedUrl.hostname === "youtube.com"
    ) {
      return parsedUrl.searchParams.get("v");
    }

    if (parsedUrl.hostname === "youtu.be") {
      return parsedUrl.pathname.substring(1);
    }

    return null;
  } catch (error) {
    console.error("URL de YouTube inválida:", url, error);
    return null;
  }
}