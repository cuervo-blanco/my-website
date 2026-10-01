import PageSeo from "../components/common/PageSeo";
import Footer from "../components/layout/Footer";
import Portfolio from "../components/sections/Portfolio";
import portfolioBackground from "../assets/img/portfolio-background.jpg";
import { pageMetadata } from "../config/site";
import {
  portfolioStats,
  portfolioStructuredData,
} from "../config/prerender";

function PortfolioPage() {
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
            <p className="portfolio-page-eyebrow">Portfolio</p>
            <h1>Sound work across film, podcasts, and music</h1>
            <p className="portfolio-page-intro">
              This page collects selected production sound, post-production,
              sound design, Foley, ambience, editorial, and music work in one
              place. It is meant to be browsed by discipline, not just by title.
            </p>
            <p className="portfolio-page-note">
              If you are checking fit for a project, the fastest path is to jump
              straight to the section closest to the work you need.
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

        <section className="portfolio-page-overview" aria-labelledby="portfolio-overview-heading">
          <div className="portfolio-page-shell portfolio-page-overview-grid">
            <div className="portfolio-page-overview-copy">
              <h2 id="portfolio-overview-heading">What is on this page</h2>
              <p>
                The portfolio is organized into three working lanes: narrative
                podcast production, music releases, and film sound samples. That
                structure mirrors how the work is usually evaluated in real life.
              </p>
              <p>
                Each section includes enough descriptive text to make the work
                readable for humans and indexable for search engines, instead of
                hiding everything inside embeds.
              </p>
            </div>

            <nav className="portfolio-page-nav" aria-label="Portfolio sections">
              <a href="#portfolio-podcasts">Podcasts</a>
              <a href="#portfolio-music">Music</a>
              <a href="#portfolio-films">Films</a>
            </nav>
          </div>
        </section>

        <Portfolio />
      </main>
      <Footer />
    </>
  );
}

export default PortfolioPage;
