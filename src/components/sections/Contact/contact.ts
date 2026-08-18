/**
 * Contact — dos vistas independientes (mismo patrón que Cases: grid <-> detalle).
 * Vista "default": título grande + tabs, sin formulario.
 * Vista "active": título angosto/rotado + tabs + el panel del servicio elegido.
 */

const contact = document.querySelector<HTMLElement>("#contact");

if (!contact) {
  throw new Error("Contact section not found");
}

const buttons =
  contact.querySelectorAll<HTMLButtonElement>("[data-form]");

const panels =
  contact.querySelectorAll<HTMLElement>("[data-form-panel]");

const closeForms = () => {
  contact.classList.remove("is-form-open");

  buttons.forEach((button) => {
    button.classList.remove("is-active");
  });

  panels.forEach((panel) => {
    panel.hidden = true;
  });

  const titleImage =
    contact.querySelector<HTMLImageElement>("[data-contact-title]");

  const formWrapper =
    contact.querySelector<HTMLElement>("[data-contact-form]");

  if (titleImage && formWrapper) {
    titleImage.src = formWrapper.dataset.defaultTitle ?? "";
    titleImage.alt = "Cuéntanos tu reto";
  }
};

const openForm = (formType: string, activeButton: HTMLButtonElement) => {
  contact.classList.add("is-form-open");

  buttons.forEach((button) => {
    button.classList.toggle("is-active", button === activeButton);
  });

  panels.forEach((panel) => {
    panel.hidden = panel.dataset.formPanel !== formType;
  });

  const titleImage =
    contact.querySelector<HTMLImageElement>("[data-contact-title]");

  const formWrapper =
    contact.querySelector<HTMLElement>("[data-contact-form]");

  if (!titleImage || !formWrapper) return;

  const titleImages: Record<string, string | undefined> = {
    clientes: formWrapper.dataset.titleClientes,
    trabajo: formWrapper.dataset.titleTrabajo,
    proveedores: formWrapper.dataset.titleProveedores,
  };

  const imageSrc = titleImages[formType];

  if (imageSrc) {
    titleImage.src = imageSrc;
  }
};

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const formType = button.dataset.form;

    if (!formType) return;

    const isActive = button.classList.contains("is-active");

    if (isActive) {
      closeForms();
      return;
    }

    openForm(formType, button);
  });
});

/* =========================
   Input de archivos
========================= */

const fileInputs =
  contact.querySelectorAll<HTMLInputElement>('input[type="file"]');

fileInputs.forEach((input) => {
  const fileName = input
    .closest(".contact-file")
    ?.querySelector<HTMLElement>(".contact-file-name");

  if (!fileName) return;

  input.addEventListener("change", () => {
    const file = input.files?.[0];

    fileName.textContent = file
      ? file.name
      : "Ningún archivo seleccionado";
  });
});


closeForms();