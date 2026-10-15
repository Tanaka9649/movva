/**
 * CONFIGURAÇÃO CENTRAL DA LANDING PAGE
 *
 * Todo o conteúdo editável do evento fica neste arquivo.
 * Regra geral: deixe vazio ("" ou []) tudo que ainda não estiver confirmado.
 * Blocos com valores vazios não aparecem na página pública.
 *
 * Para ATIVAR AS INSCRIÇÕES, preencha apenas o campo `registrationUrl`
 * com o endereço completo (começando com https://).
 */

export type Speaker = {
  name: string;
  specialty: string;
  bio: string;
  /** Caminho da foto dentro de /public, ex.: "/palestrantes/nome.jpg" */
  photo: string;
};

export type ScheduleItem = {
  time: string;
  title: string;
  description?: string;
};

export type Testimonial = {
  quote: string;
  author: string;
  role?: string;
};

export type PastEventPhoto = {
  src: string;
  alt: string;
  /** Identificação obrigatória da edição/evento em que a foto foi feita */
  caption: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type Contact = {
  label: string;
  href: string;
  value: string;
};

export const evento = {
  // ---------------------------------------------------------------
  // INSCRIÇÃO — único campo a alterar para ativar o botão final
  // ---------------------------------------------------------------
  registrationUrl: "https://convidados-avanca.replit.app/e/movva-planejamento-sucessorio-2026-11-11",

  // ---------------------------------------------------------------
  // IDENTIFICAÇÃO DO EVENTO
  // ---------------------------------------------------------------
  /** Nome provisório até a confirmação do nome oficial */
  name: "Movva",
  theme: "Planejamento sucessório e proteção patrimonial",
  description:
    "Uma imersão para empresários e produtores rurais que querem compreender como preparar a sucessão, organizar o patrimônio e dar continuidade aos negócios entre gerações.",

  // ---------------------------------------------------------------
  // DATA, HORÁRIO E LOCAL (preencha apenas quando confirmados)
  // ---------------------------------------------------------------
  /** Texto livre, ex.: "14 de novembro de 2026" */
  date: "11 de novembro de 2026",
  /** Texto livre, ex.: "8h às 18h" */
  time: "",
  /** Nome do local, ex.: "Centro de Convenções" */
  venue: "",
  /** Endereço completo */
  address: "",
  /** Cidade/UF, ex.: "Frutal/MG" */
  city: "Frutal/MG",

  // ---------------------------------------------------------------
  // INVESTIMENTO (nunca tratar como gratuito por ausência de preço)
  // ---------------------------------------------------------------
  /** Texto livre, ex.: "R$ 1.200,00" */
  price: "",
  /** Observação sobre o preço, ex.: "em até 3x no cartão" */
  priceNote: "",
  /** O que está incluído na inscrição (somente itens confirmados) */
  inclusions: [] as string[],

  // ---------------------------------------------------------------
  // PALESTRANTES, PROGRAMAÇÃO E PROVA SOCIAL
  // Seções ficam ocultas enquanto as listas estiverem vazias.
  // ---------------------------------------------------------------
  speakers: [] as Speaker[],
  /** Formato do evento, ex.: "Presencial, em um dia" */
  format: "Mesa redonda",
  schedule: [] as ScheduleItem[],
  testimonials: [] as Testimonial[],
  pastEventPhotos: [] as PastEventPhoto[],

  // ---------------------------------------------------------------
  // IMAGENS E MARCAS
  // ---------------------------------------------------------------
  /** Logo completa (símbolo + MOVVA + tagline) com texto branco — para fundos escuros */
  logo: "/brand/movva-logo-claro.png",
  /** Logo completa com texto preto — para fundos claros */
  logoOnLight: "/brand/movva-logo-escuro.png",
  /** Símbolo isolado — para espaços pequenos (cabeçalho, ícone) e marca d'água */
  symbol: "/brand/movva-simbolo.png",
  /** Texto alternativo da logo */
  logoAlt: "Movva Planejamento Sucessório",

  // ---------------------------------------------------------------
  // REALIZAÇÃO E CONTATOS
  // ---------------------------------------------------------------
  /** Nome de quem realiza, ex.: "Empresa X" */
  organizer: "",
  /** Logo da realização em /public */
  organizerLogo: "",
  /** Site institucional da realização */
  organizerUrl: "",
  /** Contatos reais. Ex.: { label: "WhatsApp", value: "(34) 0000-0000", href: "https://wa.me/55..." } */
  contacts: [] as Contact[],

  // ---------------------------------------------------------------
  // PERGUNTAS FREQUENTES
  // ---------------------------------------------------------------
  /**
   * Perguntas respondíveis apenas com informações já confirmadas.
   * Pagamento, cancelamento, certificado, atendimento individual e
   * confirmação de inscrição devem ser adicionados aqui somente
   * quando houver respostas oficiais.
   */
  faq: [
    {
      question: "Para quem é a imersão?",
      answer:
        "Para empresários, produtores rurais, sócios, sucessores e famílias empresárias que querem preparar a continuidade do patrimônio e dos negócios entre gerações.",
    },
    {
      question: "Quando, onde e em qual formato será realizada?",
      answer: "No dia 11 de novembro de 2026, em Frutal/MG, no formato de mesa redonda.",
    },
    {
      question: "Quais temas serão abordados?",
      answer:
        "A imersão se organiza em três frentes: planejamento sucessório, proteção e organização patrimonial, e continuidade dos negócios e da família.",
    },
    {
      question: "Os temas se aplicam a propriedades rurais e imóveis?",
      answer:
        "Sim. As discussões consideram empresas familiares, propriedades rurais e imóveis, que costumam concentrar boa parte do patrimônio das famílias empresárias.",
    },
    {
      question: "Familiares que não atuam no negócio também podem se interessar?",
      answer:
        "Sim. A imersão foi pensada também para familiares envolvidos no futuro do negócio, incluindo quem não participa da gestão no dia a dia.",
    },
  ] as FaqItem[],
};

export type Evento = typeof evento;

/** Retorna true apenas para endereços http(s) válidos. */
export function isValidRegistrationUrl(value: string): boolean {
  if (!value || !value.trim()) return false;
  try {
    const url = new URL(value.trim());
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}
