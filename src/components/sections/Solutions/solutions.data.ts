/*import influencerBg from "../../../assets/images/solutions/bg_interior01.avif"; Imagen de fondo para cada solucion influencerBg (de momento es la misma imagen para todas, pero se puede cambiar en el futuro)*/
import influencerBg from "../../../assets/images/solutions/INFLUENCER.avif";
import totalPromotionBg from "../../../assets/images/solutions/total-promotion.avif";
import shopperBg from "../../../assets/images/solutions/SHOPPER.avif";
import innovationBg from "../../../assets/images/solutions/FONDO.avif";
import advertisingBg from "../../../assets/images/solutions/ADVERTISING.avif";
import experienceBg from "../../../assets/images/solutions/EXPERIENCIE.avif";
import strategicBg from "../../../assets/images/solutions/DISENO.avif";

import influencerIcon from "../../../assets/icons/solutions/icon-influencer.svg"
import totalIcon from "../../../assets/icons/solutions/icon-promotion.svg"
import shopperIcon from "../../../assets/icons/solutions/icon-shopper.svg"
import innovationIcon from "../../../assets/icons/solutions/icon-inovation_lab.svg"
import advertisingIcon from "../../../assets/icons/solutions/icon-advertisin.svg"
import experienceIcon from "../../../assets/icons/solutions/icon-experience.svg"
import strategicIcon from "../../../assets/icons/solutions/icon-diseno.svg"

export interface Solution {
  id: string;

  title: string;
  subtitle: string;
  description: string;

  background: ImageMetadata;

  /** Texto que aparece alrededor del diagrama */
  label: string[];

  icon: ImageMetadata;

  /** left | middle | end */
  textAnchor: "start" | "middle" | "end";
}

export const solutions: Solution[] = [
  {
    id: "influencer",

    title: "Influencer",
    subtitle: "& Social Hub",

    description:
      "Diseñamos ecosistemas de creadores, contenido y conversación social para construir relevancia, confianza y conexión cultural.",

    label: [
      "Influencer",
      "& Social Hub",
    ],
      
    background: influencerBg,

    icon:influencerIcon,


    textAnchor: "middle",
  },

  {
    id: "total-promotion",

    title: "Total",
    subtitle: "Promotion",

    description:
      "Desde la idea a la acción, desarrollo y administración de promociones conectivas en cualquier punto de venta. Estrategia, desarrollo, soluciónes legales y CRM / Contact Center.",
    
    label: [
      "Total",
      "Promotion",
    ],

    background: totalPromotionBg,

    icon:totalIcon,

    textAnchor: "start",
  },

  {
    id: "shopper-connections",

    title: "Shopper",
    subtitle: "Connections",

    description:
      "Creamos conexiones de valor en todo el trayecto de compra omnicanal. Shopper Marketing, Retail Media, Pharma OTC.",

    label: [
      "Shopper",
      "Connections",
    ],

    background: shopperBg,

    icon:shopperIcon,

    textAnchor: "start",
  },

  {
    id: "innovation-lab",

    title: "Innovation",
    subtitle: "Lab",

    description:
      "El laboratorio que garantiza la vanguardia. Transformamos datos, tendencias y tecnología en soluciones ágiles y flexibles. Data Intelligence, Trendhunting, Propósito y Sostenibilidad, etc.",

    label: [
      "Innovation",
      "Lab",
    ],

    background: innovationBg,

    icon:innovationIcon,

    textAnchor: "start",
  },

  {
    id: "advertising",

    title: "Advertising",
    subtitle: "",

    description:
      "Del Posicionamiento y construcción de marca al shopper Push. Campañas integrales con Estrategia, Creatividad y Paid Media.",

    label: [
      "Advertising",
    ],

    background: advertisingBg,

    icon:advertisingIcon,

    textAnchor: "middle",
  },

  {
    id: "experience-marketing",

    title: "Experience",
    subtitle: "Marketing",

    description:
      "Creamos experiencias conectivas uniendo el mundo físico y el digital para agregar valor al consumidor y a tu marca. Event Marketing, BTL, Expos, Retailtainment, Programas especializados.",

    label: [
      "Experience",
      "Marketing",
    ],

    background: experienceBg,

    icon:experienceIcon,

    textAnchor: "end",
  },

  {
    id: "strategic-design",

    title: "Diseño",
    subtitle: "Estratégico",

    description:
      "Creación y gestión de identidad de marca. Branding, Arquitectura, Packaging, Shopper, etc.",

    label: [
      "Diseño",
      "Estratégico",
    ],

    background: strategicBg,

    icon:strategicIcon,

    textAnchor: "end",
  },
];

/** Índice para acceder rápidamente a una solución por su id */
export const solutionsById: Record<string, Solution> = Object.fromEntries(
  solutions.map((solution) => [solution.id, solution])
);
