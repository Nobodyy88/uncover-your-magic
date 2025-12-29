import type { Translations } from "./pl";

export const en: Translations = {
  header: {
    nav: {
      products: "Products",
      productItems: {
        tires: "Tires",
        rims: "Rims",
        regeneration: "Regeneration",
        rideOn: "Ride On",
      },
      service: "Service",
      serviceItems: {
        repairs: "Repairs",
        serviceContract: "Service Contract",
        mounting: "Mounting",
      },
      services: "Services",
      realizations: "Projects",
      about: "About",
      partners: "Partners",
      partnerNetwork: "Partner Network",
      contact: "Contact",
    },
    cta: "Book a visit",
    phone: "+48 123 456 789",
  },
  hero: {
    badge: "Professional tire service",
    headline1: "We put your business in motion.",
    headline2: "Solid tires.",
    headline2b: "Reliable construction site.",
    headline3: "We specialize in delivery and installation of tires for construction machinery – excavators, loaders, dump trucks and other heavy equipment. We will deliver the right tires and install them at your chosen location and time.",
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
      "WM Tyres is a comprehensive partner for tire solutions in the construction industry across Europe. We offer a wide selection of tires and rims for excavators, loaders, dump trucks, and all types of construction and earthmoving machinery.",
      "Our services include professional installation, retreading, and repairs — carried out on-site at the customer's location or in our workshop. With flexible service agreements and our efficient Ride-On service, we ensure minimal downtime and maximum efficiency for your fleet.",
      "Whether you're replacing worn tires or need urgent repairs — WM Tyres guarantees speed, reliability, and top-level support. All our employees have undergone comprehensive training and hold the necessary certifications.",
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
  team: {
    title: "OUR",
    titleHighlight: "TEAM",
    members: [
      {
        name: "Erik Willering",
        role: "CEO",
        description: "Erik Willering is the CEO of WM Tyres, known for his hands-on management approach, industry expertise, and customer-first mindset. He drives innovation and service excellence across the European tire solutions network.",
      },
      {
        name: "Paweł Pastor",
        role: "Sales Manager",
        description: "Paweł Pastor is the Sales Manager at WM Tyres, where he focuses on building strong client relationships and delivering tailored tire solutions. With deep market knowledge, he ensures customer satisfaction across our European network.",
      },
      {
        name: "Ola Willering - Pastor",
        role: "Accounting",
        description: "Ola Pastor is the Accountant at WM Tyres, responsible for accurate financial management and invoicing. With meticulous attention to detail and strong organizational skills, she supports the smooth operation of the company.",
      },
    ],
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
      email: { label: "Email", value: "kontakt@wmtyres.pl" },
      address: { label: "Address", value: "ul. Przemysłowa 15, Warsaw" },
      hours: { label: "Hours", value: "Mon-Fri: 7:00-18:00, Sat: 8:00-14:00" },
    },
    urgent: {
      title: "Urgent matter?",
      description: "Call now - we operate 24/7",
    },
    form: {
      title: "Contact form",
      name: { label: "Full name", placeholder: "John Smith" },
      phone: { label: "Phone", placeholder: "+48 123 456 789" },
      email: { label: "Email", placeholder: "john@company.com" },
      machine: { label: "Machine type", placeholder: "e.g. CAT 320 Excavator" },
      message: {
        label: "Message",
        placeholder:
          "Describe what you need - type of service, preferred date, location...",
      },
      submit: "Send message",
      submitting: "Sending...",
    },
    toast: {
      title: "Message sent!",
      description: "We will contact you as soon as possible.",
      errorTitle: "Sending failed",
      errorDescription: "Failed to send message. Please try again later or call us.",
    },
  },
  brands: {
    label: "Trusted brands",
    title: "BRANDS WE",
    titleHighlight: "SELL",
  },
  partners: {
    label: "Coverage",
    title: "PARTNER",
    titleHighlight: "NETWORK",
    description:
      "With an extensive dealer network across Europe, WM Tyres ensures fast delivery, professional service, and on-site support. Our connected teams guarantee consistent quality, reliable repairs, and professional installation — no matter where your machines operate. We keep your fleet running smoothly and safely.",
  },
  partnerNetwork: {
    title: "PARTNER NETWORK",
    titleHighlight: "WM TYRES NETWORK",
    featuresTitle: "OUR",
    featuresTitleHighlight: "STRENGTHS",
    headline: "Europe's leading industrial tire network — available 24 hours a day, 7 days a week",
    description:
      "WM Tyres Network is Europe's leading provider of tire sales and comprehensive service solutions for commercial vehicles. We provide 24/7 support for any tire issue, helping your machines get back to work as quickly as possible. Together with our partners, we deliver top-tier services, making us trusted tire specialists across Europe. Our partner service network continues to grow, covering leasing companies, industry, transportation, agriculture, and earthmoving — sectors where we are the undisputed leader.",
    features: {
      materials: {
        title: "Right materials, right location",
        description:
          "WM Tyres ensures delivery of the right materials to the right place. We offer world-class Ride-On tire sealant and Ride-On TWC®, providing excellent protection against rim corrosion and the effects of underinflation.",
      },
      assortment: {
        title: "Wide range — from 25 to 57 inches",
        description:
          "We offer an extensive selection of new and used tires in all sizes. We are the only supplier providing comprehensive tire installation services for sizes from 25 to 57 inches.",
      },
      downtime: {
        title: "Minimizing downtime",
        description:
          "WM Tyres resolves issues as quickly as possible, reducing costly downtime. In the construction industry, every hour of standstill means real losses — that's why we act without delay.",
      },
      service: {
        title: "Round-the-clock service",
        description:
          "WM Tyres is the only supplier offering truly 24/7 service: on-site tire mounting and dismounting, pickup of damaged tires, and delivery of new or repaired tires within 48 hours.",
      },
    },
    cta: {
      title: "JOIN OUR",
      titleHighlight: "NETWORK",
      description: "Contact us to learn more about partnership opportunities and how to join the European WM Tyres network.",
      button: "Contact us",
    },
  },
  footer: {
    description:
      "Professional replacement and repair of tires for construction machinery. 15 years of experience, 24/7 mobile service.",
    quickLinks: "Quick links",
    contactTitle: "Contact",
    copyright: "WM Tyres. All rights reserved.",
  },
  pages: {
    comingSoon: "Page content coming soon...",
    tires: {
      title: "TIRES",
      subtitle: "WM Tyres Products",
      features: {
        pressure: {
          title: "We reduce pressure",
          description: "WM Tyres reduces pressure by quickly and effectively solving problems — because machines cannot afford downtime. Time is money.",
        },
        service: {
          title: "24/7 on-site assistance",
          description: "WM Tyres is the only supplier offering true 24/7 assistance. We handle tire mounting and dismounting on-site, pick up damaged tires, and return repaired or new tires within just two days.",
        },
        partnerships: {
          title: "Strong partnerships across Europe",
          description: "WM Tyres works closely with a network of experienced partners across Europe who share our values and commitment to customer service. Thanks to these strong partnerships, we are able to provide fast and effective solutions — no matter where you are.",
        },
      },
    },
    serviceContract: {
      title: "SERVICE CONTRACT",
      subtitle: "WM Tyres Service",
      sections: {
        individual: {
          title: "Individual service contracts ensuring maximum peace of mind",
          description: "At WM Tyres, we understand that every company has different needs. That's why we offer flexible service contracts, fully tailored to your fleet, machinery, and usage patterns. Whether you operate in construction, transportation, agriculture, or industry — our contracts are designed so you can operate without interruptions.",
        },
        predictable: {
          title: "Predictable costs, no surprises",
          description: "A service contract provides full control over maintenance costs. With fixed rates and clear agreements, you avoid unexpected expenses and downtime. It's an economical way to ensure your tires are always in perfect condition.",
        },
        priority: {
          title: "Priority service and fast response",
          description: "Contract customers receive priority treatment, faster response times, guaranteed availability, and direct access to our technical support team. Whether it's repair, inspection, or replacement — we're ready when you need us.",
        },
        partner: {
          title: "One partner, comprehensive support",
          description: "With a WM Tyres service contract, you gain one reliable partner who will meet all your tire needs across Europe. We handle everything — from monitoring and maintenance to emergency response — so you can focus on running your business.",
        },
      },
      cta: {
        title: "Contact",
        description: "Contact WM Tyres today to receive expert advice, fast service, and reliable support no matter where your machines operate.",
        button: "Contact us",
      },
    },
    rideOn: {
      title: "RIDE ON",
      subtitle: "WM Tyres Products",
      features: {
        protection: {
          title: "Protection against punctures and downtime",
          description: "Ride-On is an advanced tire sealant system that instantly protects against pressure loss in case of puncture. This keeps your machines running without downtime, and repair costs drop dramatically. Ride-On works proactively — it protects the tire before damage even occurs.",
        },
        longevity: {
          title: "Extends tire life by up to 25%",
          description: "Ride-On TWC® (Tire & Wheel Care) not only seals punctures, but also protects rims from corrosion and minimizes the effects of underinflation. Even mass distribution in the tire reduces vibrations and decreases tread wear, extending tire life by up to 25%.",
        },
        savings: {
          title: "Time and cost savings",
          description: "Machines equipped with Ride-On require significantly less tire-related maintenance. Fewer repairs, lower fuel consumption thanks to proper pressure, and no unplanned downtime translate into tangible savings and greater productivity for your fleet.",
        },
      },
    },
  },
  meta: {
    title: "WM Tyres - Professional construction machinery tire service",
    description:
      "We specialize in replacing and repairing tires for excavators, loaders, forklifts. 24/7 mobile service, 15 years of experience. Book a free quote!",
    keywords:
      "tire replacement, construction machinery, excavator tires, loader tires, tire service, vulcanization",
  },
};
