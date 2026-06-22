import { pageMetadata, siteMetadata, socialLinks } from "./site";
import { filmProjects, musicAlbums, podcastFeature } from "../data/portfolio";

const totalFilmSamples = filmProjects.reduce(
  (sampleCount, project) => sampleCount + project.tracks.length,
  0
);

export const homeStructuredData = [
  {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteMetadata.shortTitle,
    alternateName: siteMetadata.legalName,
    url: siteMetadata.url,
    email: siteMetadata.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: "New York",
      addressRegion: "NY",
      addressCountry: "US",
    },
    jobTitle: "Sound Mixer, Sound Designer, and Audio Programmer",
    sameAs: socialLinks.map((link) => link.href),
    knowsAbout: [
      "Production sound",
      "Post-production sound",
      "Sound design",
      "Podcast audio",
      "Audio programming",
      "DSP",
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: siteMetadata.siteName,
    url: siteMetadata.url,
    description: pageMetadata.home.description,
    areaServed: "New York, United States",
    serviceType: [
      "Production sound",
      "Post-production sound",
      "Sound design",
      "Podcast production",
      "Audio programming",
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

export const dspStructuredData = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: pageMetadata.dspDictionary.title,
  description: pageMetadata.dspDictionary.description,
  url: `${siteMetadata.url}${pageMetadata.dspDictionary.path}`,
  author: {
    "@type": "Person",
    name: siteMetadata.shortTitle,
    url: siteMetadata.url,
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

export const prerenderRoutes = [
  {
    ...pageMetadata.home,
    structuredData: homeStructuredData,
  },
  {
    ...pageMetadata.portfolio,
    structuredData: portfolioStructuredData,
  },
  {
    ...pageMetadata.dspDictionary,
    structuredData: dspStructuredData,
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
