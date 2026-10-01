import { pageMetadata, siteMetadata, socialLinks } from "./site";
import { filmProjects, musicAlbums, podcastFeature } from "../data/portfolio";
import { githubProfileUrl } from "../data/software";
import { filmCredits, getFilmImdbUrl } from "../data/film";

const personId = `${siteMetadata.url}/#jaime-osvaldo`;
export const personStructuredData = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": personId,
  name: siteMetadata.shortTitle,
  alternateName: siteMetadata.legalName,
  url: `${siteMetadata.url}/`,
  ...(siteMetadata.email ? { email: siteMetadata.email } : {}),
  address: {
    "@type": "PostalAddress",
    addressLocality: "New York",
    addressRegion: "NY",
    addressCountry: "US",
  },
  jobTitle: ["Sound Mixer", "Sound Designer", "Software Developer", "Audio Programmer", "Animator"],
  sameAs: [...socialLinks.map((link) => link.href), githubProfileUrl],
  knowsAbout: ["Production sound", "Post-production sound", "Film sound design", "Theater sound design", "Live audio", "Audio programming", "Software development", "Digital signal processing", "Animation"],
};

const totalFilmSamples = filmProjects.reduce(
  (sampleCount, project) => sampleCount + project.tracks.length,
  0
);

export const homeStructuredData = [
  personStructuredData,
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${siteMetadata.url}/#services`,
    name: "Film and theater sound, audio programming, software development and animation",
    url: `${siteMetadata.url}/contact`,
    provider: { "@id": personId },
    description: pageMetadata.home.description,
    areaServed: { "@type": "City", name: "New York" },
    serviceType: [
      "Production sound",
      "Post-production sound",
      "Sound design",
      "Theatre/live audio",
      "Podcast production",
      "Audio programming",
      "Audio software consulting",
      "Software development",
      "Animation",
    ],
    sameAs: socialLinks.map((link) => link.href),
  },
];

export const portfolioStructuredData = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: pageMetadata.portfolio.title,
  description: pageMetadata.portfolio.description,
  url: `${siteMetadata.url}${pageMetadata.portfolio.path}`,
  author: {
    "@type": "Person",
    name: siteMetadata.shortTitle,
    url: siteMetadata.url,
  },
  about: [
    "Production sound",
    "Post-production sound",
    "Sound design",
    "Podcast production",
    "Music production",
  ],
  hasPart: [
    {
      "@type": "PodcastSeries",
      name: podcastFeature.embedTitle,
      description: podcastFeature.description,
    },
    ...musicAlbums.map((album) => ({
      "@type": "MusicAlbum",
      name: album.title,
      url: album.href,
    })),
    ...filmProjects.map((project) => ({
      "@type": "CreativeWork",
      name: project.title,
      genre: "Film sound",
    })),
  ],
};

export const workStructuredData = [
  ...homeStructuredData,
  {
    ...portfolioStructuredData,
    "@id": `${siteMetadata.url}/#work`,
    name: pageMetadata.home.title,
    description: pageMetadata.home.description,
    author: { "@id": personId },
    about: ["Film sound mixing", "Film sound design", "Theater sound", "Live audio"],
    hasPart: [
      ...filmCredits.map((credit) => ({
        "@type": "Movie",
        name: credit.title,
        sameAs: getFilmImdbUrl(credit),
        contributor: { "@id": personId },
      })),
      ...portfolioStructuredData.hasPart.filter((work) => work["@type"] !== "CreativeWork"),
    ],
  },
];

export const softwareStructuredData = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: pageMetadata.devHome.title,
  description: pageMetadata.devHome.description,
  url: `${siteMetadata.url}${pageMetadata.devHome.path}`,
  author: personStructuredData,
  about: ["Audio programming", "Software development", "Digital signal processing"],
  sameAs: [githubProfileUrl],
  hasPart: [
    {
      "@type": "WebPage",
      name: "GitHub",
      url: githubProfileUrl,
    },
    {
      "@type": "Article",
      name: "DSP Dictionary",
      url: `${siteMetadata.url}/dev#dsp-dictionary`,
    },
  ],
};

export const dspStructuredData = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: pageMetadata.dspDictionary.title,
  description: pageMetadata.dspDictionary.description,
  url: `${siteMetadata.url}/dev#dsp-dictionary`,
  author: {
    ...personStructuredData,
  },
  about: [
    "Digital audio",
    "EQ",
    "Compression",
    "Reverb",
    "DSP",
    "Audio plugins",
  ],
};

export const animationStructuredData = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: pageMetadata.art.title,
  description: pageMetadata.art.description,
  url: `${siteMetadata.url}/art`,
  author: personStructuredData,
  about: ["Animation", "Sound design"],
  hasPart: {
    "@type": "VideoObject",
    name: "Dark Knites logo animation",
    description: "Animation and original sound by Jaime Osvaldo, created with Blender, DaVinci Resolve, Logic Pro, and SuperCollider.",
    contentUrl: `${siteMetadata.url}/media/dark-knites-logo.mp4`,
    thumbnailUrl: `${siteMetadata.url}/media/dark-knites-poster.jpg`,
    creator: { "@id": personId },
  },
};

export const contactStructuredData = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: pageMetadata.contact.title,
  description: pageMetadata.contact.description,
  url: `${siteMetadata.url}/contact`,
  about: personStructuredData,
};

export const prerenderRoutes = [
  {
    ...pageMetadata.home,
    structuredData: workStructuredData,
  },
  {
    ...pageMetadata.devHome,
    structuredData: softwareStructuredData,
  },
  {
    ...pageMetadata.contact,
    structuredData: contactStructuredData,
  },
  {
    ...pageMetadata.art,
    structuredData: animationStructuredData,
  },
  {
    ...pageMetadata.terms,
  },
];

export const portfolioStats = {
  filmProjects: filmProjects.length,
  musicReleases: musicAlbums.length,
  totalFilmSamples,
};
