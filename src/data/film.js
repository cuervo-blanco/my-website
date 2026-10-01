// Credits verified against https://www.imdb.com/name/nm12085051/ on 2026-10-01.
// Add a title here to update the filmography. Use a verified IMDb title ID;
// only add a production stage, year, poster, or media link when confirmed.
export const imdbProfileUrl = "https://www.imdb.com/name/nm12085051/";
export const filmCreditsVerifiedOn = "2026-10-01";

export const filmCredits = [
  {
    id: "tt34001425",
    title: "Krazy Klowny",
    featured: true,
    type: "Feature film",
    stage: "Post-production",
    forthcoming: true,
    roles: ["Production sound", "Score mixing", "Sound design", "Sound editing", "Sound effects editing", "Music editing", "Score production"],
    additionalRoles: ["Executive producer", "Unit production manager", "Special effects makeup artist", "Actor: Brad The Script Writer"],
    mediaLinks: [
      { label: "Watch sizzle reel", href: "https://www.imdb.com/video/vi1734527769/" },
      { label: "Film photos", href: "https://www.imdb.com/title/tt34001425/mediaviewer/rm4164267266/" },
    ],
  },
  {
    id: "tt39372938",
    title: "Dead Man's Creek",
    featured: true,
    type: "Feature film",
    stage: "Post-production",
    // Updated directly by Jaime on 2026-10-01.
    forthcoming: true,
    roles: ["Production sound", "Score mixing", "Sound design", "Sound editing", "Sound effects editing", "Music editing", "Score production"],
    additionalRoles: ["Executive producer", "Unit production manager"],
  },
  {
    id: "tt29930555",
    title: "How to Disappear Completely",
    type: "Short film",
    stage: "Post-production",
    forthcoming: true,
    roles: ["Sound"],
  },
  {
    id: "tt26909607",
    title: "Queer Khalifa",
    type: "Short film",
    stage: "Completed",
    roles: ["Sound recordist"],
    // The official site has published the film, although IMDb groups it as upcoming.
    mediaLinks: [{ label: "Watch the film", href: "https://www.queerkhalifa.com/watch-film" }],
  },
  {
    id: "tt24989938",
    title: "The Omicron Killer",
    featured: true,
    type: "Feature film",
    year: 2024,
    poster: "/img/OmicronPoster.png",
    roles: ["Production sound", "Score mixing", "Sound design", "Sound editing", "Sound effects editing", "Music editing", "Score production"],
    additionalRoles: ["Co-executive producer", "Gaffer", "Actor: Newsroom Sound Guy"],
  },
  {
    id: "tt27597099",
    title: "Madre Nuestra",
    type: "Short film",
    year: 2023,
    roles: ["Sound mixer"],
  },
  {
    id: "tt29147338",
    title: "La Creación",
    type: "Short film",
    year: 2023,
    roles: ["Composer"],
  },
  {
    id: "tt20203344",
    title: "Hijas de la Invasión",
    type: "Short film",
    year: 2022,
    poster: "/img/HDLIPoster.png",
    roles: ["Foley artist", "Sound designer"],
  },
  {
    id: "tt28156108",
    title: "No Pienses en Monos",
    type: "Podcast series · 11 episodes",
    year: 2022,
    roles: ["Sound designer", "Sound mixer", "Sound recordist", "Composer", "Producer", "Director", "Narrator and character voices"],
  },
  {
    id: "tt23328170",
    title: "Mulheres Árvore",
    type: "Short film",
    year: 2022,
    roles: ["Foley artist"],
  },
  {
    id: "tt21797078",
    title: "Soberane",
    type: "Short film",
    year: 2022,
    roles: ["Foley artist"],
  },
  {
    id: "tt22778358",
    title: "Juan Caballo",
    type: "Short film",
    year: 2022,
    poster: "/img/JCPoster.png",
    roles: ["Sound designer"],
  },
  {
    id: "tt21949322",
    title: "La Obra",
    type: "Short film",
    year: 2022,
    poster: "/img/LaObraPoster.png",
    roles: ["Sound designer", "Sound recordist", "Composer", "Musician: flute"],
  },
  {
    id: "tt20412784",
    title: "El Pastor",
    type: "Short film",
    year: 2022,
    poster: "/img/ElPastorPoster.png",
    roles: ["Sound designer", "Sound mixer"],
  },
  {
    id: "tt15017122",
    title: "Duelistas",
    type: "Short film",
    year: 2021,
    roles: ["Actor: Esteban"],
  },
  {
    id: "tt13508874",
    title: "Carreras en el Aire",
    type: "Short film",
    year: 2020,
    roles: ["Assistant sound mixer"],
  },
  {
    id: "tt12420486",
    title: "El momento de las lechuzas",
    type: "Short film",
    year: 2020,
    roles: ["Boom operator"],
  },
];

// Verified on the film's official watch page; no autoplay or downloaded copy.
export const featuredFilmVideo = {
  title: "Queer Khalifa",
  role: "Sound recordist",
  embedUrl: "https://player.vimeo.com/video/840386792",
  officialUrl: "https://www.queerkhalifa.com/watch-film",
};

export function getFilmImdbUrl(credit) {
  return `https://www.imdb.com/title/${credit.id}/`;
}
