import { LucideIcon, Home, Users, Network, Wrench, Circle, RefreshCw, Package, FileText, Settings, Hammer } from 'lucide-react';

/**
 * Struktura sekcji strony
 */
export interface PageSection {
  name: string;
  keys: string[];
}

/**
 * Struktura strony w panelu admina
 */
export interface PageConfig {
  id: string;
  title: string;
  icon: LucideIcon;
  previewUrl: string;
  sections: PageSection[];
}

/**
 * Mapowanie wszystkich stron i ich sekcji do kluczy tłumaczeń
 */
export const pageStructure: Record<string, PageConfig> = {
  index: {
    id: 'index',
    title: 'Index (Strona główna)',
    icon: Home,
    previewUrl: '/',
    sections: [
      {
        name: 'Hero',
        keys: [
          'hero.badge',
          'hero.headline1',
          'hero.headline2',
          'hero.headline2b',
          'hero.headline3',
          'hero.ctaPrimary',
          'hero.ctaSecondary',
          'hero.features.quality',
          'hero.features.fast',
          'hero.features.experience',
        ],
      },
      {
        name: 'Services',
        keys: [
          'services.label',
          'services.title',
          'services.titleHighlight',
          'services.description',
          'services.items[0].title',
          'services.items[0].description',
          'services.items[0].features[0]',
          'services.items[0].features[1]',
          'services.items[0].features[2]',
          'services.items[0].features[3]',
          'services.items[1].title',
          'services.items[1].description',
          'services.items[1].features[0]',
          'services.items[1].features[1]',
          'services.items[1].features[2]',
          'services.items[1].features[3]',
          'services.items[2].title',
          'services.items[2].description',
          'services.items[2].features[0]',
          'services.items[2].features[1]',
          'services.items[2].features[2]',
          'services.items[2].features[3]',
          'services.items[3].title',
          'services.items[3].description',
          'services.items[3].features[0]',
          'services.items[3].features[1]',
          'services.items[3].features[2]',
          'services.items[3].features[3]',
        ],
      },
      {
        name: 'About',
        keys: [
          'about.label',
          'about.title',
          'about.titleHighlight',
          'about.paragraphs[0]',
          'about.paragraphs[1]',
          'about.paragraphs[2]',
          'about.stats[0].value',
          'about.stats[0].label',
          'about.stats[1].value',
          'about.stats[1].label',
          'about.stats[2].value',
          'about.stats[2].label',
          'about.stats[3].value',
          'about.stats[3].label',
          'about.images.alt1',
          'about.images.alt2',
          'about.images.alt3',
          'about.images.alt4',
        ],
      },
      {
        name: 'Team',
        keys: [
          'team.title',
          'team.titleHighlight',
          'team.members[0].name',
          'team.members[0].role',
          'team.members[0].description',
          'team.members[1].name',
          'team.members[1].role',
          'team.members[1].description',
          'team.members[2].name',
          'team.members[2].role',
          'team.members[2].description',
        ],
      },
      {
        name: 'Realizations',
        keys: [
          'realizations.label',
          'realizations.title',
          'realizations.titleHighlight',
          'realizations.description',
          'realizations.items[0].title',
          'realizations.items[0].date',
          'realizations.items[0].location',
          'realizations.items[0].description',
          'realizations.items[0].type',
          'realizations.items[1].title',
          'realizations.items[1].date',
          'realizations.items[1].location',
          'realizations.items[1].description',
          'realizations.items[1].type',
          'realizations.items[2].title',
          'realizations.items[2].date',
          'realizations.items[2].location',
          'realizations.items[2].description',
          'realizations.items[2].type',
          'realizations.items[3].title',
          'realizations.items[3].date',
          'realizations.items[3].location',
          'realizations.items[3].description',
          'realizations.items[3].type',
          'realizations.items[4].title',
          'realizations.items[4].date',
          'realizations.items[4].location',
          'realizations.items[4].description',
          'realizations.items[4].type',
          'realizations.items[5].title',
          'realizations.items[5].date',
          'realizations.items[5].location',
          'realizations.items[5].description',
          'realizations.items[5].type',
        ],
      },
      {
        name: 'Contact',
        keys: [
          'contact.label',
          'contact.title',
          'contact.titleHighlight',
          'contact.description',
          'contact.info.title',
          'contact.info.phone.label',
          'contact.info.phone.value',
          'contact.info.email.label',
          'contact.info.email.value',
          'contact.info.address.label',
          'contact.info.address.value',
          'contact.info.hours.label',
          'contact.info.hours.value',
          'contact.urgent.title',
          'contact.urgent.description',
          'contact.form.title',
          'contact.form.name.label',
          'contact.form.name.placeholder',
          'contact.form.phone.label',
          'contact.form.phone.placeholder',
          'contact.form.email.label',
          'contact.form.email.placeholder',
          'contact.form.machine.label',
          'contact.form.machine.placeholder',
          'contact.form.message.label',
          'contact.form.message.placeholder',
          'contact.form.submit',
          'contact.form.submitting',
          'contact.toast.title',
          'contact.toast.description',
          'contact.toast.errorTitle',
          'contact.toast.errorDescription',
        ],
      },
      {
        name: 'Brands',
        keys: [
          'brands.label',
          'brands.title',
          'brands.titleHighlight',
        ],
      },
    ],
  },
  about: {
    id: 'about',
    title: 'O nas',
    icon: Users,
    previewUrl: '/o-nas',
    sections: [
      {
        name: 'About',
        keys: [
          'about.label',
          'about.title',
          'about.titleHighlight',
          'about.paragraphs[0]',
          'about.paragraphs[1]',
          'about.paragraphs[2]',
          'about.stats[0].value',
          'about.stats[0].label',
          'about.stats[1].value',
          'about.stats[1].label',
          'about.stats[2].value',
          'about.stats[2].label',
          'about.stats[3].value',
          'about.stats[3].label',
          'about.images.alt1',
          'about.images.alt2',
          'about.images.alt3',
          'about.images.alt4',
        ],
      },
      {
        name: 'Team',
        keys: [
          'team.title',
          'team.titleHighlight',
          'team.members[0].name',
          'team.members[0].role',
          'team.members[0].description',
          'team.members[1].name',
          'team.members[1].role',
          'team.members[1].description',
          'team.members[2].name',
          'team.members[2].role',
          'team.members[2].description',
        ],
      },
    ],
  },
  partnerNetwork: {
    id: 'partnerNetwork',
    title: 'Sieć partnerów',
    icon: Network,
    previewUrl: '/siec-partnerow',
    sections: [
      {
        name: 'Partners',
        keys: [
          'partners.label',
          'partners.title',
          'partners.titleHighlight',
          'partners.description',
        ],
      },
      {
        name: 'Partner Network',
        keys: [
          'partnerNetwork.title',
          'partnerNetwork.titleHighlight',
          'partnerNetwork.featuresTitle',
          'partnerNetwork.featuresTitleHighlight',
          'partnerNetwork.headline',
          'partnerNetwork.description',
          'partnerNetwork.features.materials.title',
          'partnerNetwork.features.materials.description',
          'partnerNetwork.features.assortment.title',
          'partnerNetwork.features.assortment.description',
          'partnerNetwork.features.downtime.title',
          'partnerNetwork.features.downtime.description',
          'partnerNetwork.features.service.title',
          'partnerNetwork.features.service.description',
          'partnerNetwork.cta.title',
          'partnerNetwork.cta.titleHighlight',
          'partnerNetwork.cta.description',
          'partnerNetwork.cta.button',
        ],
      },
    ],
  },
  tires: {
    id: 'tires',
    title: 'Opony',
    icon: Circle,
    previewUrl: '/produkty/opony',
    sections: [
      {
        name: 'Tires',
        keys: [
          'pages.tires.title',
          'pages.tires.subtitle',
          'pages.tires.features.pressure.title',
          'pages.tires.features.pressure.description',
          'pages.tires.features.service.title',
          'pages.tires.features.service.description',
          'pages.tires.features.partnerships.title',
          'pages.tires.features.partnerships.description',
        ],
      },
    ],
  },
  rims: {
    id: 'rims',
    title: 'Felgi',
    icon: Settings,
    previewUrl: '/produkty/felgi',
    sections: [
      {
        name: 'Content',
        keys: [
          'pages.comingSoon',
        ],
      },
    ],
  },
  regeneration: {
    id: 'regeneration',
    title: 'Regeneracja',
    icon: RefreshCw,
    previewUrl: '/produkty/regeneracja',
    sections: [
      {
        name: 'Content',
        keys: [
          'pages.comingSoon',
        ],
      },
    ],
  },
  rideOn: {
    id: 'rideOn',
    title: 'Ride On',
    icon: Package,
    previewUrl: '/produkty/ride-on',
    sections: [
      {
        name: 'Ride On',
        keys: [
          'pages.rideOn.title',
          'pages.rideOn.subtitle',
          'pages.rideOn.features.protection.title',
          'pages.rideOn.features.protection.description',
          'pages.rideOn.features.longevity.title',
          'pages.rideOn.features.longevity.description',
          'pages.rideOn.features.savings.title',
          'pages.rideOn.features.savings.description',
        ],
      },
    ],
  },
  repairs: {
    id: 'repairs',
    title: 'Naprawy',
    icon: Wrench,
    previewUrl: '/serwis/naprawy',
    sections: [
      {
        name: 'Content',
        keys: [
          'pages.comingSoon',
        ],
      },
    ],
  },
  serviceContract: {
    id: 'serviceContract',
    title: 'Umowa serwisowa',
    icon: FileText,
    previewUrl: '/serwis/umowa-serwisowa',
    sections: [
      {
        name: 'Service Contract',
        keys: [
          'pages.serviceContract.title',
          'pages.serviceContract.subtitle',
          'pages.serviceContract.sections.individual.title',
          'pages.serviceContract.sections.individual.description',
          'pages.serviceContract.sections.predictable.title',
          'pages.serviceContract.sections.predictable.description',
          'pages.serviceContract.sections.priority.title',
          'pages.serviceContract.sections.priority.description',
          'pages.serviceContract.sections.partner.title',
          'pages.serviceContract.sections.partner.description',
          'pages.serviceContract.cta.title',
          'pages.serviceContract.cta.description',
          'pages.serviceContract.cta.button',
        ],
      },
    ],
  },
  mounting: {
    id: 'mounting',
    title: 'Montaż',
    icon: Hammer,
    previewUrl: '/serwis/montaz',
    sections: [
      {
        name: 'Content',
        keys: [
          'pages.comingSoon',
        ],
      },
    ],
  },
};

/**
 * Pobierz listę wszystkich stron
 */
export function getAllPages(): PageConfig[] {
  return Object.values(pageStructure);
}

/**
 * Pobierz konfigurację strony po ID
 */
export function getPageById(pageId: string): PageConfig | undefined {
  return pageStructure[pageId];
}

/**
 * Pobierz wszystkie klucze tłumaczeń dla strony
 */
export function getPageTranslationKeys(pageId: string): string[] {
  const page = getPageById(pageId);
  if (!page) return [];

  return page.sections.flatMap(section => section.keys);
}
