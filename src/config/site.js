const clientEnv = typeof import.meta !== "undefined" ? import.meta.env : {};

export const siteMetadata = {
  title: "Jaime Osvaldo | New York Sound Mixer & Sound Designer",
  shortTitle: "Jaime Osvaldo",
  legalName: "Jaime O. Rivera Santana",
  siteName: "Jaime Osvaldo",
  description:
    "New York sound mixer and sound designer for film and theater. Explore Jaime Osvaldo's credits, audio programming, software development, and animation.",
  url: "https://jaimeosvaldo.com",
  defaultSocialImage: "/studio-preview.jpg",
  socialImageAlt: "Jaime Osvaldo — sound, software and animation in New York",
  themeColor: "#000000",
  email: clientEnv.VITE_CONTACT_EMAIL || "",
  location: "New York, NY",
  resumePath: "/CV/JaimeORiveraCV-2025v09.pdf",
  reelStoragePath: "videos/jaime-rivera-reel.mov",
  contactEndpoint:
    clientEnv.VITE_CONTACT_ENDPOINT || "https://api.web3forms.com/submit",
  web3FormsAccessKey:
    clientEnv.VITE_WEB3FORMS_ACCESS_KEY ||
    "728e095b-d681-46ad-ad89-457e17a8353e",
};

export const homeHeroContent = {
  eyebrow: siteMetadata.legalName,
  title: "Sound Mixer, Sound Designer & Audio Programmer",
  subtitle:
    "I work across production sound, theatre/live audio, and custom audio software - building practical tools for real-world sound workflows.",
  summary:
    "Sound work + software development, built from field experience in film, theatre, live sound, and post-production.",
};

export const pageMetadata = {
  home: {
    title: siteMetadata.title,
    description:
      siteMetadata.description,
    path: "/",
    type: "website",
    keywords: [
      "jaime osvaldo",
      "film sound",
      "live audio",
      "audio software",
      "dsp",
      "art and animation",
    ],
  },
  film: {
    title: siteMetadata.title,
    description:
      siteMetadata.description,
    path: "/",
    type: "website",
    keywords: [
      "production sound mixer",
      "film sound mixer",
      "post production sound",
      "sound designer film",
      "film audio new york",
    ],
  },
  portfolio: {
    title: `Samples | ${siteMetadata.shortTitle}`,
    description:
      "Selected samples across film sound, podcast production, music releases, post-production, Foley, ambience, and sound design by Jaime Osvaldo.",
    path: "/",
    type: "website",
    keywords: [
      "film sound samples",
      "film sound portfolio",
      "podcast sound design",
      "audio post production samples",
      "jaime osvaldo samples",
    ],
  },
  live: {
    title: `Live / Theatre | ${siteMetadata.shortTitle}`,
    description:
      "Theatre, school productions, festivals, awards, and live-event audio work by Jaime Osvaldo.",
    path: "/",
    type: "website",
    keywords: [
      "theatre audio",
      "live sound",
      "a1 sound engineer",
      "sound design theatre",
      "event audio new york",
    ],
  },
  liveCompanies: {
    title: `Companies | ${siteMetadata.shortTitle}`,
    description:
      "Production partners, brands, and institutions connected to Jaime Osvaldo's live and theatre audio work.",
    path: "/",
    type: "website",
  },
  devHome: {
    title: `${siteMetadata.shortTitle} | NYC Software Developer & Audio Programmer`,
    description:
      "Jaime Osvaldo, New York audio programmer and software developer. Explore his GitHub and interactive DSP Dictionary with audio demos, controls, and formulas.",
    path: "/dev",
    type: "website",
    keywords: [
      "audio software developer",
      "audio dsp",
      "juce c++ audio",
      "audio workflow tools",
    ],
  },
  software: {
    title: `${siteMetadata.shortTitle} | NYC Software Developer & Audio Programmer`,
    description:
      "Jaime Osvaldo, New York audio programmer and software developer. Explore his GitHub and interactive DSP Dictionary with audio demos, controls, and formulas.",
    path: "/dev",
    type: "website",
    keywords: [
      "audio software developer",
      "audio plugin development",
      "juce c++ audio",
      "dsp prototype",
      "audio workflow tools",
      "show control utilities",
    ],
  },
  dspDictionary: {
    title: `DSP Dictionary | ${siteMetadata.shortTitle}`,
    description:
      "Interactive audio DSP concepts: graphs, controls, and formulas.",
    path: "/dev",
    type: "article",
    keywords: [
      "audio dsp dictionary",
      "digital signal processing audio",
      "compression eq reverb explained",
      "audio plugin development notes",
    ],
  },
  art: {
    title: `New York Animator & Sound Designer | ${siteMetadata.shortTitle}`,
    description:
      "Animation and original sound by New York animator Jaime Osvaldo. Watch Dark Knites, created with Blender, DaVinci Resolve, Logic Pro, and SuperCollider.",
    path: "/art",
    type: "website",
  },
  artAbout: {
    title: `About Art | ${siteMetadata.shortTitle}`,
    description:
      "Animation and visual work by Jaime Osvaldo.",
    path: "/art/about",
    type: "website",
  },
  contact: {
    title: `Contact | ${siteMetadata.shortTitle}`,
    description: "Contact Jaime Osvaldo in New York for film and theater sound mixing, sound design, audio programming, software development, and animation.",
    path: "/contact",
    type: "website",
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
  { label: "Work", type: "route", to: "/", icon: "portfolio" },
  { label: "Dev", type: "route", to: "/dev", icon: "software" },
  { label: "Animation", type: "route", to: "/art", icon: "home" },
  {
    label: "Resume",
    type: "external",
    href: siteMetadata.resumePath,
    icon: "resume",
    target: "_blank",
    rel: "noopener noreferrer",
  },
  { label: "Contact", type: "route", to: "/contact", icon: "contact" },
];

export const footerQuickLinks = [
  { label: "Work", type: "route", to: "/" },
  { label: "Dev", type: "route", to: "/dev" },
  { label: "Animation", type: "route", to: "/art" },
  {
    label: "Resume",
    type: "external",
    href: siteMetadata.resumePath,
    target: "_blank",
    rel: "noopener noreferrer",
  },
  { label: "Contact", type: "route", to: "/contact" },
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
  { label: "Samples", type: "route", to: "/#portfolio-films" },
  { label: "Film", type: "route", to: "/#credits" },
  { label: "Contact", type: "route", to: "/contact" },
];

export const contactSubjects = [
  { value: "production-sound", label: "Production Sound" },
  { value: "sound-design", label: "Sound Design" },
  { value: "theatre-live-audio", label: "Theatre / Live Audio" },
  {
    value: "audio-software-plugin-development",
    label: "Audio Software / Plugin Development",
  },
  { value: "technical-consulting", label: "Technical Consulting" },
  { value: "other", label: "Other" },
];

export const contactIntro =
  "Reach out for sound work, audio software collaboration, technical consulting, or custom workflow tools.";
