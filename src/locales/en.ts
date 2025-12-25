import type { Translations } from "./pl";

export const en: Translations = {
  header: {
    nav: {
      services: "Services",
      realizations: "Projects",
      about: "About",
      contact: "Contact",
    },
    cta: "Book a visit",
    phone: "+48 123 456 789",
  },
  hero: {
    badge: "Professional tire service",
    headline1: "We put your business in motion.",
    headline2: "Solid tires, reliable construction site.",
    headline3: "Sales, replacement and on-site installation",
    ctaPrimary: "Get a free quote",
    ctaSecondary: "See our projects",
    features: {
      quality: "Quality guarantee",
      fast: "Fast service",
      experience: "15 years of experience",
    },
  },
  services: {
    label: "What we offer",
    title: "OUR",
    titleHighlight: "SERVICES",
    description:
      "Comprehensive tire service for construction machinery. From replacement to consulting - everything in one place.",
    items: [
      {
        title: "Tire replacement",
        description: "Professional tire replacement for all types of construction machinery.",
        features: ["Excavators", "Loaders", "Forklifts", "Road rollers"],
      },
      {
        title: "Tire repair",
        description: "We repair damaged tires, extending their lifespan.",
        features: ["Vulcanization", "Patching", "Regeneration", "Valve replacement"],
      },
      {
        title: "Mobile service",
        description: "We come to your machine's work location.",
        features: ["Free travel", "24/7", "Entire region", "Fast response"],
      },
      {
        title: "Consulting",
        description: "We help you choose the right tires for your machines.",
        features: ["Tire selection", "Optimization", "Consultations", "Wholesale offers"],
      },
    ],
  },
  about: {
    label: "About us",
    title: "ABOUT WM TYRES",
    titleHighlight: "TIRE EXPERTS",
    paragraphs: [
      "We specialize in the delivery and installation of tires for heavy machinery such as excavators, loaders, dump trucks, and all types of construction equipment. Whether you're dealing with worn treads or want to upgrade your tires — we'll deliver the right tires and install them at your chosen location and time.",
      "We offer high-quality products, fast delivery, and professional installation. Our services include retreading, repairs, and on-site support — backed by flexible service agreements that minimize downtime for your machines.",
      "All our employees have undergone comprehensive training and hold the necessary certifications.",
    ],
    stats: [
      { value: "500+", label: "Satisfied customers" },
      { value: "15", label: "Years of experience" },
      { value: "2000+", label: "Services completed" },
      { value: "24/7", label: "Service availability" },
    ],
    images: {
      alt1: "Construction machine",
      alt2: "Excavator",
      alt3: "Construction site",
      alt4: "Construction machinery",
    },
  },
  realizations: {
    label: "Portfolio",
    title: "RECENT",
    titleHighlight: "PROJECTS",
    description:
      "See our latest work. We treat every project with full professionalism and attention to detail.",
    items: [
      {
        title: "Tire replacement in CAT 320 excavator",
        date: "December 15, 2024",
        location: "Warsaw",
        description:
          "Complete replacement of 4 tires in a tracked excavator. The client came with damaged tracks after intensive construction work.",
        type: "Excavator",
      },
      {
        title: "Volvo L90 loader service",
        date: "December 12, 2024",
        location: "Krakow",
        description:
          "Replacement of front tires and repair of the rear left tire. On-site service at the construction site.",
        type: "Loader",
      },
      {
        title: "Tires for Toyota forklift",
        date: "December 10, 2024",
        location: "Lodz",
        description: "Installation of new solid tires for a forklift operating in a warehouse.",
        type: "Forklift",
      },
      {
        title: "BOMAG roller tire repair",
        date: "December 8, 2024",
        location: "Poznan",
        description:
          "Vulcanization of a damaged road roller tire. Quick repair allowed work to continue.",
        type: "Roller",
      },
      {
        title: "JCB backhoe loader tire replacement",
        date: "December 5, 2024",
        location: "Gdansk",
        description:
          "Full tire set replacement in a backhoe loader. Tire selection adapted to wet terrain conditions.",
        type: "Backhoe loader",
      },
      {
        title: "Construction fleet service",
        date: "December 1, 2024",
        location: "Wroclaw",
        description:
          "Comprehensive inspection and tire replacement in 5 machines for a construction company. Service agreement.",
        type: "Fleet",
      },
    ],
  },
  contact: {
    label: "Contact",
    title: "BOOK A",
    titleHighlight: "VISIT",
    description:
      "Need tire replacement? Contact us - we'll prepare an individual quote and schedule a convenient time.",
    info: {
      title: "Contact details",
      phone: { label: "Phone", value: "+48 123 456 789" },
      email: { label: "Email", value: "kontakt@oponypro.pl" },
      address: { label: "Address", value: "ul. Przemysłowa 15, Warsaw" },
      hours: { label: "Hours", value: "Mon-Fri: 7:00-18:00, Sat: 8:00-14:00" },
    },
    urgent: {
      title: "Urgent matter?",
      description: "Call now - we operate 24/7",
    },
    form: {
      title: "Contact form",
      name: { label: "Full name *", placeholder: "John Smith" },
      phone: { label: "Phone *", placeholder: "+48 123 456 789" },
      email: { label: "Email", placeholder: "john@company.com" },
      machine: { label: "Machine type", placeholder: "e.g. CAT 320 Excavator" },
      message: {
        label: "Message *",
        placeholder:
          "Describe what you need - type of service, preferred date, location...",
      },
      submit: "Send message",
      submitting: "Sending...",
    },
    toast: {
      title: "Message sent!",
      description: "We will contact you as soon as possible.",
    },
  },
  partners: {
    label: "Coverage",
    title: "PARTNER",
    titleHighlight: "NETWORK",
    description:
      "With an extensive dealer network across Europe, WM Tyres ensures fast delivery, professional service, and on-site support. Our connected teams guarantee consistent quality, reliable repairs, and professional installation — no matter where your machines operate. We keep your fleet running smoothly and safely.",
  },
  footer: {
    description:
      "Professional replacement and repair of tires for construction machinery. 15 years of experience, 24/7 mobile service.",
    quickLinks: "Quick links",
    contactTitle: "Contact",
    copyright: "WM Tyres. All rights reserved.",
  },
  meta: {
    title: "TiresPro - Professional construction machinery tire service",
    description:
      "We specialize in replacing and repairing tires for excavators, loaders, forklifts. 24/7 mobile service, 15 years of experience. Book a free quote!",
    keywords:
      "tire replacement, construction machinery, excavator tires, loader tires, tire service, vulcanization",
  },
};
