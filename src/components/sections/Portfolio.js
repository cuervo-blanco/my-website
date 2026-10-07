import AudioPlayer from "../common/AudioPlayer";
import Button from "../common/Button";
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

function CompactPortfolio() {
  return (
    <div className="work-samples work-page__shell surface-panel">
      <section id="portfolio-films" aria-labelledby="portfolio-films-heading">
        <p className="studio-kicker">Audio samples</p>
        <h3 id="portfolio-films-heading">Scene samples</h3>
        <p className="studio-section-intro">Foley, ambience, sound design, and music. Select a film to play its audio clips.</p>
        <div className="work-samples__films">
          {filmProjects.map((project) => (
            <details key={project.title} className="work-samples__project">
              <summary>
                <img src={`/img/${project.poster}`} alt="" loading="lazy" />
                <span>{project.title}<small>{project.tracks.length} audio clips</small></span>
              </summary>
              <AudioPlayer title={project.title} poster={project.poster} tracks={project.tracks} ext=".mp3" assetPath={audioAssetBasePath} />
            </details>
          ))}
        </div>
      </section>
      <details className="work-samples__other">
        <summary>Music &amp; podcasts</summary>
        <section id="portfolio-podcasts" aria-labelledby="portfolio-podcasts-heading">
          <h3 id="portfolio-podcasts-heading">{podcastFeature.embedTitle}</h3>
          <iframe className="work-samples__podcast" title={podcastFeature.embedTitle} allow="autoplay" loading="lazy" src={podcastFeature.embedUrl} />
        </section>
        <section id="portfolio-music" aria-labelledby="portfolio-music-heading">
          <h3 id="portfolio-music-heading">Music</h3>
          <div className="work-samples__albums">
            {musicAlbums.map((album) => (
              <article key={album.id}>
                <h4><a href={album.href} target="_blank" rel="noopener noreferrer">{album.title}</a></h4>
                <iframe title={`Bandcamp album: ${album.title}`} style={{ height: `${album.height}px` }} src={album.embedUrl} loading="lazy" />
              </article>
            ))}
          </div>
        </section>
      </details>
    </div>
  );
}

function Portfolio({
  compact = false,
  showTechnicalSection = true,
  technicalLink = "/dev/projects",
}) {
  if (compact) return <CompactPortfolio />;
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
                />
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

      {showTechnicalSection ? (
        <section
          id="portfolio-technical"
          className="portfolio-showcase-section"
          aria-labelledby="portfolio-technical-heading"
        >
          <div className="portfolio-page-shell portfolio-technical-grid">
            <header className="portfolio-section-copy">
              <p className="portfolio-section-kicker">Technical / Software Work</p>
              <h2 id="portfolio-technical-heading">Technical / Software Work</h2>
              <p>
                Alongside my sound work, I build audio-focused software tools and
                DSP experiments designed around real production problems.
              </p>
            </header>

            <div className="portfolio-technical-card">
              <p>
                That side of the work includes plugin concepts, workflow
                utilities, show control experiments, and technically grounded
                consulting for teams working with sound.
              </p>
              <Button buttonText="View Audio Software Work" buttonLink={technicalLink} />
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}

export default Portfolio;
