import type { ImageMetadata } from "astro";
import capistranoGrid from "../../../assets/images/cases/caso1.jpg";
import walmartGrid from "../../../assets/images/cases/caso2.jpg";
import fantaGrid from "../../../assets/images/cases/caso3.jpg";
import kelloggsGrid from "../../../assets/images/cases/caso4.jpg";
import hotsaleGrid from "../../../assets/images/cases/caso5.jpg";
import eggoGrid from "../../../assets/images/cases/caso6.jpg";
import mezcladitoGrid from "../../../assets/images/cases/caso7.jpg";
import baitGrid from "../../../assets/images/cases/caso8.jpg"

import kelloggsDetail from "../../../assets/images/cases/kelloggs.jpg";
import mezcladitoDetail from "../../../assets/images/cases/MEZCLADITO.jpg";
import eggoPoster from "../../../assets/images/cases/waffles.jpg";
import hotsalePoster from "../../../assets/images/cases/hotsale.jpg";
import walmartPoster from "../../../assets/images/cases/maestros.jpg";
import fantaPoster from "../../../assets/images/cases/fanta.webp";
import capistranoPoster from "../../../assets/images/cases/capis.jpg"
import baitDetail from "../../../assets/images/cases/bait.jpg"

export interface Case {
  id: string;
  title: string;
  client: string;
  /** Imagen de la tarjeta */
  gridImage: ImageMetadata;
  description: string;
  /** URL del video (si existe) */
  video?: string;
  /** Imagen de portada del video */
  videoPoster?:ImageMetadata;
  /** Imagen para cuando no hay video */
  detailImage?: ImageMetadata;
  solutionIds: string[];
}

export const cases: Case[] = [
  {
    id: "capistrano",
    title: "EXPOS CAPISTRANO",
    client: "Grupo Capistrano Alimentari",
    gridImage: capistranoGrid,
    description:
      "Con el propósito de atraer y generar lazos memorables con socios comerciales asistentes a las expos más relevantes del mercado en México, diseñamos y montamos stands que reforzaron el catálogo de productos, las marcas y la experiencia de consumo.",
    video: "https://www.youtube.com/watch?v=UA00xoYs8Wo",
    videoPoster:capistranoPoster,
    solutionIds: [
      "experience-marketing",
      "total-promotion"
    ]
  },
  {
    id: "walmart",
    title: "MAESTROS DE LA PARRILLA",
    client: "WALMART EXPRESS",
    gridImage: walmartGrid,
    description:"Maestros de la Parrilla, una idea que transformó un objetivo de venta en una experiencia transmedia, por 8 años consecutivos y ayudó a crear una cultura del asado en el Centro de México. La experiencia se adaptó a diferentes realidades, posicionando un discurso diferenciado durante el verano y fortaleciendo la identidad de Walmart como un autoservicio con variedad y calidad.",
    video:"https://www.youtube.com/watch?v=7fBQznPDkWc",
    videoPoster:walmartPoster,
    solutionIds: [
      "experience-marketing",
        "total-promotion"
        ]
  },
{
    id: "fanta",
    title: "SNACK TOUR",
    client: "FANTA",
    gridImage: fantaGrid,
    description:"La pregunta es… ¿cuál es el snack que más se disfruta con Fanta? La respuesta la encontramos en el snack tour de Fanta con 5 influencers viajando por 5 países disfrutando de los snacks más atrevidos. Un evento internacional en el que logramos conectar al target con sus antojos favoritos.",
    video:"https://www.youtube.com/watch?v=-e2sS_EqfE4",
    videoPoster:fantaPoster,
    solutionIds: [
      "influencer",
        "experience-marketing"
        ]
  },
  {
    id: "kelloggs",
    title: "CONVENCIÓN DE VENTAS",
    client: "KELLOGG'S",
    gridImage: kelloggsGrid,
    description:"Kellanova México nos desafió a motivar a sus equipos comerciales para lograr metas de venta y generar mayor engagement con la compañía. Desarrollamos un concepto y storytelling con el potencial de desdoblarse y mantener el interés de los asistentes con la producción de escenario, dinámicas, experiencias y logística durante 5 días del evento.",
    detailImage: kelloggsDetail,
    solutionIds: [
      "experience-marketing",
        "total-promotion"
        ]
  },
  {
    id: "hotsale",
    title: "CONCIERTO HOT SALE",
    client: "BODEGA AURRERA",
    gridImage: hotsaleGrid,
    description:"Bodega Aurrera nos retó a despertar el interés, convocatoria y asistencia a sus tiendas durante el Kick off de Hot Sale, generando diferentes oportunidades de compra en los departamentos participantes en tienda y en línea; así que armamos un concierto en grande con la mismísima Margarita, la Diosa de la Cumbia en la azotea del WTC de la CDMX, transmitiendo en vivo en las redes de la marca.",
    video:"https://www.youtube.com/watch?v=xrjbnepVWbA",
    videoPoster:hotsalePoster,
    solutionIds: [
      "experience-marketing",
        "total-promotion",
        "influencer"
        ]
  },
  {
    id: "eggo",
    title: "EGGO WAFFLES",
    client: "KELLOGG'S",
    gridImage: eggoGrid,
    description:"Los mexicanos somos prácticos, creativos y antojadizos; atributos que van de la mano con Eggo Waffles. Así que una vez brifeados por la marca, generamos un práctico recetario descargable y una campaña apalancada de influencers, para invitar a shoppers y consumidores a descubrir la deliciosa versatilidad de Eggo, direccionándolos en PDV con material shopper marketing.",
    video:"https://www.youtube.com/watch?v=nkBpu3Yr1kw",
    videoPoster:eggoPoster,
    solutionIds: [
      "influencer",
      "shopper-connections"
        ]
  },
  /*{
    id: "mezcladito",
    title: "MEZCLADITO",
    client: "KELLOGG'S",
    gridImage: mezcladitoGrid,
    description:"Ser incluyente es lograr que todos se sientan bienvenidos a la mesa. Kellogg´s lo entiende muy bien y nos encomendó la tarea de diseñar el empaque Edición Especial de Mezcladito. Nos enorgullece el resultado que iluminó los anaqueles de autoservicio en el mes para celebrar la autenticidad de todos, todas y todes.",
    detailImage:mezcladitoDetail,
    solutionIds: [
      "strategic-design",
        ]
  },
  {
    id: "bait",
    title: "DILE BAIT A LOS LÍMITES",
    client: "BAIT",
    gridImage: baitGrid,
    description:"Hoy más que nunca necesitamos estar conectados, con los que queremos, con lo que nos gusta, con lo que hacemos, pero elegir la compañía telefónica para hacerlo, es todo un reto. Llevamos Bait a todo el país, la mejor telefonía, con excelente conectividad y a un precio justo para decirle adiós a los límites.",
    detailImage:baitDetail,
    solutionIds: [
      "advertising",
        "total-promotion"
        ]
  },*/
];
