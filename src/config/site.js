const clientEnv = typeof import.meta !== "undefined" ? import.meta.env : {};

export const siteMetadata = {
  title: "Jaime Osvaldo | Sound Mixer, Designer, and Audio Programmer",
  shortTitle: "Jaime Osvaldo",
  legalName: "Jaime O. Rivera Santana",
  siteName: "Jaime Osvaldo",
  description:
    "Sound mixer, recordist, designer, and audio programmer based in New York. Production sound, post-production, live performance, and interactive audio support for film, theater, podcasts, and music.",
  url: "https://jaimeosvaldo.com",
  defaultSocialImage: "/og-image.png",
  socialImageAlt: "Jaime Osvaldo website preview",
  themeColor: "#040404",
  email: "support@jaimeosvaldo.com",
  location: "New York, NY",
  resumePath: "/CV/JaimeORiveraCV-2025v09.pdf",
  reelStoragePath: "videos/jaime-rivera-reel.mov",
  contactEndpoint:
    clientEnv.VITE_CONTACT_ENDPOINT || "https://api.web3forms.com/submit",
  web3FormsAccessKey:
    clientEnv.VITE_WEB3FORMS_ACCESS_KEY ||
    "728e095b-d681-46ad-ad89-457e17a8353e",
};

export const pageMetadata = {
  home: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    path: "/",
    type: "website",
    keywords: [
      "sound mixer new york",
      "production sound mixer",
      "sound designer",
      "audio programmer",
      "film sound",
      "post production sound",
      "podcast sound design",
    ],
  },
  portfolio: {
    title: `Portfolio | ${siteMetadata.shortTitle}`,
    description:
      "Selected portfolio of film sound, podcast production, music releases, post-production, Foley, ambience, and sound design by Jaime Osvaldo.",
    path: "/portfolio",
    type: "website",
    keywords: [
      "sound design portfolio",
      "film sound portfolio",
      "podcast sound design",
      "audio post production samples",
      "jaime osvaldo portfolio",
    ],
  },
  dspDictionary: {
    title: `DSP Dictionary | ${siteMetadata.shortTitle}`,
    description:
      "An informal DSP dictionary covering digital audio, filtering, compression, modulation, distortion, mixing, and audio plugin concepts.",
    path: "/dsp-dictionary",
    type: "article",
    keywords: [
      "audio dsp dictionary",
      "digital signal processing audio",
      "compression eq reverb explained",
      "audio plugin development notes",
    ],
  },
  terms: {
    title: `Terms and Privacy | ${siteMetadata.shortTitle}`,
    description:
      "Terms, booking conditions, payment policy, and privacy information for Jaime Osvaldo services.",
    path: "/terms",
    type: "website",
    robots: "noindex,follow",
  },
};

export const mainNavigation = [
  { label: "Home", type: "route", to: "/", icon: "home" },
  { label: "Work", type: "section", to: "/", sectionId: "services", icon: "work" },
  { label: "DSP Dictionary", type: "route", to: "/dsp-dictionary", icon: "work" },
  { label: "Portfolio", type: "route", to: "/portfolio", icon: "portfolio" },
  { label: "Contact", type: "section", to: "/", sectionId: "contact", icon: "contact" },
];

export const footerQuickLinks = [
  { label: "Home", type: "route", to: "/" },
  { label: "Work", type: "section", to: "/", sectionId: "services" },
  { label: "DSP Dictionary", type: "route", to: "/dsp-dictionary" },
  { label: "Portfolio", type: "route", to: "/portfolio" },
  { label: "Contact", type: "section", to: "/", sectionId: "contact" },
];

export const legalLinks = [
  { label: "Privacy Policy", type: "section", to: "/terms", sectionId: "policy" },
  { label: "Terms of Service", type: "route", to: "/terms" },
];

export const socialLinks = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/jaime-osvaldo/",
    icon: "linkedin",
  },
  {
    label: "Instagram",
    href: "https://instagram.com/tricerebrado",
    icon: "instagram",
  },
  {
    label: "IMDb",
    href: "https://www.imdb.com/name/nm12085051/?ref_=fn_al_nm_2",
    icon: "imdb",
  },
];

export const heroActions = [
  { label: "Hear the Portfolio", type: "route", to: "/portfolio" },
  { label: "Start a Project", type: "section", to: "/", sectionId: "contact" },
];

export const contactSubjects = [
  { value: "production-sound", label: "Production Sound Services" },
  { value: "post-production-sound", label: "Post-Production Sound Services" },
  { value: "live-sound", label: "Live Sound Services" },
  { value: "rate-query", label: "Services Rate Information" },
  { value: "consultations", label: "Consultations" },
  { value: "courses", label: "Online Courses" },
  { value: "other", label: "Other" },
];
