import AudioPlayer from "../common/AudioPlayer";
import {
  audioAssetBasePath,
  filmProjects,
  musicAlbums,
  podcastFeature,
} from "../../data/portfolio";

const totalFilmSamples = filmProjects.reduce(
  (sampleCount, project) => sampleCount + project.tracks.length,
  0
);

function Portfolio() {
  return (
    <div className="portfolio-showcase">
      <section
        id="portfolio-podcasts"
        className="portfolio-showcase-section"
        aria-labelledby="portfolio-podcasts-heading"
      >
        <div className="portfolio-page-shell portfolio-showcase-grid">
          <header className="portfolio-section-copy">
            <p className="portfolio-section-kicker">Podcasts</p>
            <h2 id="portfolio-podcasts-heading">{podcastFeature.title}</h2>
            <p>{podcastFeature.description}</p>
            <p>
              This section focuses on long-form storytelling, voice performance,
              atmosphere, editorial rhythm, and how sound carries tone across
              an episodic narrative.
            </p>
          </header>

          <div className="portfolio-embed-card">
            <iframe
              className="portfolio-embed-frame"
              title={podcastFeature.embedTitle}
              allow="autoplay"
              loading="lazy"
              src={podcastFeature.embedUrl}
            />
          </div>
        </div>
      </section>

      <section
        id="portfolio-music"
        className="portfolio-showcase-section"
        aria-labelledby="portfolio-music-heading"
      >
        <div className="portfolio-page-shell">
          <header className="portfolio-section-copy portfolio-section-copy--narrow">
            <p className="portfolio-section-kicker">Music</p>
            <h2 id="portfolio-music-heading">Albums and releases</h2>
            <p>
              Selected releases spanning composition, production, texture work,
              and sound-driven world building. These records show the music side
              of the same listening practice that shapes the film and post work.
            </p>
          </header>

          <div className="portfolio-album-grid">
            {musicAlbums.map((album) => (
              <article key={album.id} className="portfolio-album-card">
                <h3>{album.title}</h3>
                <iframe
                  title={`Bandcamp album: ${album.title}`}
                  className="portfolio-album-embed"
                  style={{ height: `${album.height}px` }}
                  src={album.embedUrl}
                  loading="lazy"
                >
                  <a href={album.href}>{album.title} by Jaime Osvaldo</a>
                </iframe>
                <a
                  className="portfolio-album-link"
                  href={album.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open album on Bandcamp
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="portfolio-films"
        className="portfolio-showcase-section"
        aria-labelledby="portfolio-films-heading"
      >
        <div className="portfolio-page-shell">
          <header className="portfolio-section-copy portfolio-section-copy--narrow">
            <p className="portfolio-section-kicker">Films</p>
            <h2 id="portfolio-films-heading">Selected film sound samples</h2>
            <p>
              A curated set of scene work across {filmProjects.length} projects
              and {totalFilmSamples} sample cues. The clips cover ambience,
              Foley, sound effects, music editorial, and the small sonic details
              that build dramatic space.
            </p>
            <p>
              Recommended listens are marked directly in the cue titles so you
              can jump into the strongest examples first.
            </p>
          </header>

          <div className="portfolio-film-grid">
            {filmProjects.map((project) => (
              <AudioPlayer
                key={project.title}
                title={project.title}
                poster={project.poster}
                tracks={project.tracks}
                ext=".mp3"
                assetPath={audioAssetBasePath}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Portfolio;
