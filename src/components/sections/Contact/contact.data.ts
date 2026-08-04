export type ContactFormType =
  | "clientes"
  | "trabajo"
  | "proveedores";

export type ContactFieldType =
  | "text"
  | "email"
  | "tel"
  | "textarea"
  | "file";

export interface ContactField {
  name: string;
  label: string;
  type: ContactFieldType;
  placeholder?: string;
  required?: boolean;
  accept?: string;
}

export interface ContactFormConfig {
  title: string;
  submitLabel: string;
  fields: ContactField[];
}

export const contactForms: Record<ContactFormType, ContactFormConfig> = {
  clientes: {
    title: "Clientes",
    submitLabel: "ENVIAR RETO AL SQUAD",

    fields: [
      {
        name: "fullName",
        label: "Nombre Completo",
        type: "text",
        required: true,
      },
      {
        name: "companyPosition",
        label: "Empresa y Cargo",
        type: "text",
        required: true,
      },
      {
        name: "email",
        label: "Email Corporativo",
        type: "email",
        required: true,
      },
      {
        name: "phone",
        label: "Teléfono",
        type: "tel",
        required: true,
      },
      {
        name: "challenge",
        label: "Describe brevemente el reto que enfrentas",
        type: "textarea",
        required: true,
      },
    ],
  },

  trabajo: {
    title: "Bolsa de trabajo",
    submitLabel: "ENVIAR PARA SER PARTE DE USTEDES",

    fields: [
      {
        name: "fullName",
        label: "Nombre Completo",
        type: "text",
        required: true,
      },
      {
        name: "email",
        label: "Tu Email",
        type: "email",
        required: true,
      },
      {
        name: "phone",
        label: "Teléfono",
        type: "tel",
        required: true,
      },
      {
        name: "interestArea",
        label: "Puesto / Área de Interés",
        type: "text",
        required: true,
      },
      {
        name: "profile",
        label: "Describe brevemente tu perfil",
        type: "textarea",
        required: true,
      },
      {
        name: "cv",
        label: "Sube tu CV (PDF)",
        type: "file",
        required: true,
        accept: ".pdf",
      },
    ],
  },

  proveedores: {
    title: "Proveedores",
    submitLabel: "ENVIAR PARA COLABORAR CON USTEDES",

    fields: [
      {
        name: "fullName",
        label: "Nombre Completo",
        type: "text",
        required: true,
      },
      {
        name: "companyPosition",
        label: "Empresa y Cargo",
        type: "text",
        required: true,
      },
      {
        name: "email",
        label: "Email Corporativo",
        type: "email",
        required: true,
      },
      {
        name: "phone",
        label: "Teléfono",
        type: "tel",
        required: true,
      },
      {
        name: "companyDescription",
        label: "Describe brevemente tu empresa",
        type: "textarea",
        required: true,
      },
      {
        name: "credentials",
        label: "Sube tus credenciales (PDF)",
        type: "file",
        required: true,
        accept: ".pdf",
      },
    ],
  },
};