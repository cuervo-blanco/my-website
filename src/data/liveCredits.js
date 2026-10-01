import bloomingPhoto from "../assets/img/live-work/blooming-in-dry-season.webp";
import brokenSnowPhoto from "../assets/img/live-work/broken-snow.webp";
import chitaPhoto from "../assets/img/live-work/chita-rivera-awards-2026.webp";
import bubblingArtwork from "../assets/img/live-work/bubbling-brown-sugar-2026.webp";
import washPhoto from "../assets/img/live-work/the-wash.webp";
import crackedPhoto from "../assets/img/live-work/cracked-open.webp";

// Add a production with title, roles, and an optional venue. An optional image
// makes it a gallery credit; preserve its source and photographer attribution.
// Personal roles and the four 2026 venues were supplied by Jaime on 2026-10-01.
export const liveCredits = [
  { title: "Reverend Billy and the Stop Shopping Choir", roles: ["A1"] },
  { title: "Spotlight Festival", roles: ["TD"] },
  { title: "Ain't Misbehaving", roles: ["Sound design"] },
  { title: "About Time", roles: ["Sound design"] },
  { title: "Matilda", roles: ["Sound design"] },
  { title: "Next Step Festival", roles: ["Technical director"] },
  {
    title: "The Wash",
    roles: ["A1, New Federal Theatre"],
    image: {
      src: washPhoto,
      alt: "The cast of New Federal Theatre's The Wash gathered around a table",
      width: 960,
      height: 640,
      sourceUrl: "https://nystagereview.com/2025/06/05/the-wash-airing-a-ripe-slice-of-american-history/",
      credit: "Photo: Hollis King",
      kind: "photo",
    },
  },
  {
    title: "Cracked Open",
    roles: ["A1, Theatre Row"],
    image: {
      src: crackedPhoto,
      alt: "The cast of Cracked Open onstage at Theatre Row in 2025",
      width: 700,
      height: 467,
      sourceUrl: "https://dctheaterarts.org/2025/05/20/a-familys-struggle-with-mental-illness-in-cracked-open-at-nycs-theatre-row/",
      credit: "Photo: Russ Rowland",
      kind: "photo",
    },
  },
  { title: "See What I Wanna See", roles: ["A2, Out of the Box Theatrics"] },
  { title: "American Eclipse", roles: ["Stage hand, Out of the Box Theatrics"] },
  { title: "Inspired by True Events", roles: ["A1, Out of the Box Theatrics"] },
  { title: "Windows", roles: ["A1, The Town Hall"] },
  { title: "SCAT! The Complex Lives of AL & DOT", roles: ["A1, Urban Bush Women"] },
  { title: "The World According to Mickey Grant", roles: ["QLab project design, projections technician, and sound assist"] },
  { title: "Pay the Writer", roles: ["A1, Signature Theatre / Aaron Grant Theatrical"] },
  { title: "Little Match Girl", roles: ["A1, Theatre Row"] },
  { title: "Pippin by the Dwight School", roles: ["Sound design"] },
  {
    title: "Blooming in Dry Season",
    roles: ["A1"],
    venue: "WP Theater",
    image: {
      src: bloomingPhoto,
      alt: "Melanie Matthews and Brian Richardson in Blooming in Dry Season at WP Theater",
      width: 522,
      height: 713,
      sourceUrl: "https://www.offoffonline.com/offoffonline/2026/5/30/blooming-in-dry-season",
      credit: "Photo: Hollis King",
      kind: "photo",
      position: "center top",
    },
  },
  {
    title: "Broken Snow",
    roles: ["A1"],
    venue: "Church of the Blessed Sacrament",
    image: {
      src: brokenSnowPhoto,
      alt: "Tony Danza and Tom Cavanagh in Broken Snow at Theatre 71 in 2026",
      width: 960,
      height: 640,
      sourceUrl: "https://stageandcinema.com/2026/04/28/broken-snow-theatre-71-review/",
      credit: "Photo: Shirin Tinati",
      kind: "photo",
    },
  },
  {
    title: "Chita Rivera Awards 2026",
    roles: ["A2"],
    venue: "Jack H. Skirball Center for the Performing Arts",
    image: {
      src: chitaPhoto,
      alt: "The Broadway's Next Triple Threat finalists performing Too Darn Hot at the 2026 Chita Rivera Awards",
      width: 960,
      height: 640,
      sourceUrl: "https://dancespirit.com/helena-padial-broadways-next-triple-threat/",
      credit: "Courtesy: Chita Rivera Awards / NYC Dance Alliance",
      kind: "photo",
    },
  },
  { title: "The School at Columbia Spring PAC Concert", roles: ["A1"] },
  { title: "Young People's Chorus Spring Concert", roles: ["Show support"] },
  {
    title: "Amas 2026 Benefit: Bubbling Brown Sugar",
    roles: ["SD"],
    venue: "Penthouse 45",
    image: {
      src: bubblingArtwork,
      alt: "Bubbling Brown Sugar artwork for Amas Musical Theatre's 2026 benefit",
      width: 849,
      height: 960,
      sourceUrl: "https://www.amasmusical.org/event-details/the-50th-anniversary-benefit-concert-of-bubbling-brown-sugar",
      credit: "Artwork: Amas Musical Theatre",
      kind: "artwork",
    },
  },
];
