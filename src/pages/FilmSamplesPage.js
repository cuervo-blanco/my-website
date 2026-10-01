import PageSeo from "../components/common/PageSeo";
import { Link } from "react-router-dom";
import Footer from "../components/layout/Footer";
import Portfolio from "../components/sections/Portfolio";
import portfolioBackground from "../assets/img/portfolio-background.jpg";
import { pageMetadata } from "../config/site";
import { getSiteRoute } from "../config/siteSections";
import {
  portfolioStats,
  portfolioStructuredData,
} from "../config/prerender";

function FilmSamplesPage() {
  return (
    <>
      <PageSeo
        {...pageMetadata.portfolio}
        structuredData={portfolioStructuredData}
      />
      <main id="portfolio-page" className="portfolio-page">
        <section className="portfolio-page-hero">
          <div className="portfolio-page-hero-background" aria-hidden="true">
            <img src={portfolioBackground} alt="" loading="eager" />
          </div>
          <div className="portfolio-page-shell">
            <p className="portfolio-page-eyebrow">Sound samples</p>
            <h1>Selected samples across film, podcasts, and music</h1>
            <p className="portfolio-page-intro">
              Listen to production sound, Foley, sound design, ambience, and music
              from selected projects, alongside original releases and narrative
              audio.
            </p>
            <p className="portfolio-page-note">
              <Link to={`${getSiteRoute("film")}#credits`}>Explore film credits and upcoming projects →</Link>
            </p>

            <dl className="portfolio-page-stats">
              <div>
                <dt>Film projects</dt>
                <dd>{portfolioStats.filmProjects}</dd>
              </div>
              <div>
                <dt>Sample cues</dt>
                <dd>{portfolioStats.totalFilmSamples}</dd>
              </div>
              <div>
                <dt>Music releases</dt>
                <dd>{portfolioStats.musicReleases}</dd>
              </div>
            </dl>
          </div>
        </section>

        <section
          className="portfolio-page-overview"
          aria-labelledby="portfolio-overview-heading"
        >
          <div className="portfolio-page-shell portfolio-page-overview-grid">
            <div className="portfolio-page-overview-copy">
              <h2 id="portfolio-overview-heading">Listen to the details</h2>
              <p>
                Choose a film to hear individual scene cues, or explore the
                podcast and music releases. Recommended listens are marked in
                the film cue titles.
              </p>
            </div>

            <nav className="portfolio-page-nav" aria-label="Sample sections">
              <a href="#portfolio-films">Films</a>
              <a href="#portfolio-podcasts">Podcasts</a>
              <a href="#portfolio-music">Music</a>
            </nav>
          </div>
        </section>

        <Portfolio showTechnicalSection={false} />
      </main>
      <Footer />
    </>
  );
}

export default FilmSamplesPage;
