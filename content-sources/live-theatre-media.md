# Live & Theatre image sources

Retrieved 2026-10-01. Personal roles and the four newly supplied venues come from Jaime's request. Photos and artwork are credited to their respective photographers and productions; the portfolio presents Jaime's audio/technical roles, without claiming image authorship. Each image links back to the source page, and photographer/source credits are available in the Image credits disclosure.

The local files in `src/assets/img/live-work/` are resized WebP copies for the website. They retain the original image content; only the gallery's presentation crops photographs to fit its shared aspect ratio. The benefit artwork displays in full.

| Credit | Local asset | Image attribution | Source and production match |
| --- | --- | --- | --- |
| Blooming in Dry Season | `blooming-in-dry-season.webp` | Hollis King | [Off Off Online, June 6, 2026](https://www.offoffonline.com/offoffonline/2026/5/30/blooming-in-dry-season): WP Theater production with Melanie Matthews and Brian Richardson. The same photograph and photographer credit appear in [New Federal Theatre's official publicity gallery](https://www.newfederaltheatre.com/about-1). |
| Broken Snow | `broken-snow.webp` | Shirin Tinati | [Stage and Cinema, April 28, 2026](https://stageandcinema.com/2026/04/28/broken-snow-theatre-71-review/): Tom Cavanagh and Tony Danza in the Theatre 71 production. The venue is in the Church of the Blessed Sacrament, as supplied by Jaime. |
| Chita Rivera Awards 2026 | `chita-rivera-awards-2026.webp` | Courtesy Chita Rivera Awards / New York City Dance Alliance | [Dance Spirit, June 8, 2026](https://dancespirit.com/helena-padial-broadways-next-triple-threat/): the five Broadway's Next Triple Threat finalists performing "Too Darn Hot" at the 2026 ceremony. [Official event site](https://chitariveraawards.com/) identifies May 18, 2026 at NYU Skirball. The official site's older 2025 photo gallery was deliberately not used for this 2026 credit. |
| Amas 2026 Benefit: Bubbling Brown Sugar | `bubbling-brown-sugar-2026.webp` | Artwork from Amas Musical Theatre | [Official Amas event page](https://www.amasmusical.org/event-details/the-50th-anniversary-benefit-concert-of-bubbling-brown-sugar): the 50th Anniversary Benefit Concert, May 11, 2026 at Penthouse 45. This image is show artwork, not a photograph of the 2026 performance. |
| The Wash | `the-wash.webp` | Hollis King | [New York Stage Review, June 5, 2025](https://nystagereview.com/2025/06/05/the-wash-airing-a-ripe-slice-of-american-history/): New Federal Theatre's production at WP Theater. Avoided images from other productions, including the Atlanta production. |
| Cracked Open | `cracked-open.webp` | Russ Rowland | [DC Theater Arts, May 20, 2025](https://dctheaterarts.org/2025/05/20/a-familys-struggle-with-mental-illness-in-cracked-open-at-nycs-theatre-row/): Theatre Row production, with Katherine Reis, Bart Shatto, Pamela Bob, Rubén Caballero and Blaire DiMisa. |

## Original image URLs

- Blooming: `https://images.squarespace-cdn.com/content/v1/585832425016e17cbf7235be/acd103d3-3e07-476a-8264-519a570ea4f2/Blooming+No.+2.jpg?format=1000w`
- Broken Snow: `https://stageandcinema.com/wp-content/uploads/2026/04/Tony-Danza-and-Tom-Cavanagh.-Photo-by-Shirin-Tinati-10-1024x683.jpg`
- Chita Rivera Awards: `https://dancespirit.com/wp-content/uploads/2026/06/Finalists-perform-Too-Darn-Hot-set-by-Warren-Carlyle-1024x683.jpg`
- Amas benefit artwork: `https://static.wixstatic.com/media/2fb097_07bb561172be4ed2ad53516a508ea232~mv2.png`
- The Wash: `https://i0.wp.com/nystagereview.com/wp-content/uploads/2025/06/washerwomensized-4W7A7644.jpg?resize=1200%2C800&ssl=1`
- Cracked Open: `https://dctheaterarts.org/wp-content/uploads/2025/05/Katherine-Reis-Bart-Shatto-Pamela-Bob-Ruben-Caballero-and-Blaire-DiMisa-pto-Russ-Rowland.jpg`

To add another gallery credit, add an `image` object to its row in `src/data/liveCredits.js`, with the local asset, descriptive `alt`, actual dimensions, `kind` (`photo` or `artwork`), `sourceUrl`, and attribution in `credit`. Production credits without an image remain in the concise list below the gallery.
