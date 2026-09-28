import { gsap } from "gsap";

export type FeedbackModalType =
  | "success"
  | "error"
  | "info";

export interface FeedbackModalOptions {
  type?: FeedbackModalType;
  title: string;
  message: string;
}

type FeedbackModalElement = HTMLElement & {
  dataset: DOMStringMap & {
    feedbackType?: string;
  };
};

let activeModal: FeedbackModalElement | null = null;
let previousFocus: HTMLElement | null = null;

/**
 * Abre un modal de feedback.
 */
export function showFeedbackModal(
  modal: FeedbackModalElement,
  options: FeedbackModalOptions,
): void {
  const {
    type = "info",
    title,
    message,
  } = options;

  const dialog =
    modal.querySelector<HTMLElement>(
      ".feedback-modal__dialog",
    );

  const titleElement =
    modal.querySelector<HTMLElement>(
      "[data-feedback-title]",
    );

  const messageElement =
    modal.querySelector<HTMLElement>(
      "[data-feedback-message]",
    );

  const closeButton =
    modal.querySelector<HTMLButtonElement>(
      ".feedback-modal__button[data-feedback-close]",
    );

  if (
    !dialog ||
    !titleElement ||
    !messageElement ||
    !closeButton
  ) {
    return;
  }

  if (
    activeModal &&
    activeModal !== modal
  ) {
    hideFeedbackModal(activeModal, false);
  }

  const focusedElement = document.activeElement;

  previousFocus =
    focusedElement instanceof HTMLElement
      ? focusedElement
      : null;

  activeModal = modal;

  modal.dataset.feedbackType = type;

  titleElement.textContent = title;
  messageElement.textContent = message;

  modal.setAttribute(
    "aria-hidden",
    "false",
  );

  document.body.classList.add(
    "feedback-modal-open",
  );

  gsap.killTweensOf(modal);
  gsap.killTweensOf(dialog);

  gsap.set(modal, {
    display: "flex",
    opacity: 0,
  });

  gsap.set(dialog, {
    opacity: 0,
    scale: 0.94,
    y: 18,
  });

  const timeline = gsap.timeline({
    defaults: {
      ease: "power2.out",
    },
  });

  timeline
    .to(modal, {
      opacity: 1,
      duration: 0.25,
    })
    .to(
      dialog,
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.35,
      },
      "-=0.15",
    );

  window.setTimeout(() => {
    closeButton.focus();
  }, 100);
}

/**
 * Cierra un modal de feedback.
 */
export function hideFeedbackModal(
  modal: FeedbackModalElement,
  restoreFocus = true,
): void {
  const dialog =
    modal.querySelector<HTMLElement>(
      ".feedback-modal__dialog",
    );

  if (!dialog) {
    return;
  }

  gsap.killTweensOf(modal);
  gsap.killTweensOf(dialog);

  const timeline = gsap.timeline({
    onComplete: () => {
      gsap.set(modal, {
        display: "none",
      });

      modal.setAttribute(
        "aria-hidden",
        "true",
      );

      if (activeModal === modal) {
        activeModal = null;
      }

      document.body.classList.remove(
        "feedback-modal-open",
      );

      if (
        restoreFocus &&
        previousFocus &&
        document.contains(previousFocus)
      ) {
        previousFocus.focus();
      }

      previousFocus = null;
    },
  });

  timeline
    .to(dialog, {
      opacity: 0,
      scale: 0.96,
      y: 12,
      duration: 0.2,
      ease: "power2.in",
    })
    .to(
      modal,
      {
        opacity: 0,
        duration: 0.2,
        ease: "power2.inOut",
      },
      "-=0.1",
    );
}

/**
 * Inicializa todos los FeedbackModal presentes
 * actualmente en la página.
 */
export function initFeedbackModals(): void {
  const modals =
    document.querySelectorAll<FeedbackModalElement>(
      "[data-feedback-modal]",
    );

  modals.forEach((modal) => {
    if (
      modal.dataset.feedbackInitialized ===
      "true"
    ) {
      return;
    }

    modal.dataset.feedbackInitialized =
      "true";

    const closeElements =
      modal.querySelectorAll<HTMLElement>(
        "[data-feedback-close]",
      );

    closeElements.forEach((element) => {
      element.addEventListener(
        "click",
        () => {
          hideFeedbackModal(modal);
        },
      );
    });
  });

  if (
    document.documentElement.dataset
      .feedbackModalKeyboardInitialized ===
    "true"
  ) {
    return;
  }

  document.documentElement.dataset
    .feedbackModalKeyboardInitialized =
    "true";

  document.addEventListener(
    "keydown",
    (event) => {
      if (
        event.key === "Escape" &&
        activeModal
      ) {
        hideFeedbackModal(activeModal);
      }
    },
  );
}