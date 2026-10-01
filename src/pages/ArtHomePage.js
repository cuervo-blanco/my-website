import PageSeo from "../components/common/PageSeo";
import Footer from "../components/layout/Footer";
import { pageMetadata } from "../config/site";
import "../assets/styles/animation.css";

function ArtHomePage() {
  return (
    <>
      <PageSeo {...pageMetadata.art} />
      <main id="animation-page" className="section-site-page">
        <div className="section-site-shell">
          <header className="animation-header">
            <h1>Animation</h1>
          </header>
          <figure className="animation-feature">
            <video
              controls
              playsInline
              preload="none"
              poster="/media/dark-knites-poster.jpg"
              aria-label="Dark Knites logo animation"
              aria-describedby="dark-knites-caption"
              width="1920"
              height="1080"
            >
              <source src="/media/dark-knites-logo.mp4" type="video/mp4" />
              <a href="/media/dark-knites-logo.mp4">Watch the Dark Knites logo animation</a>
            </video>
            <figcaption id="dark-knites-caption">
              <div className="animation-credit">
                <span className="animation-title">Dark Knites</span>
                <span>Animation &amp; sound — Jaime Osvaldo</span>
                <ul className="animation-tools" aria-label="Tools used">
                  <li>Blender</li>
                  <li>DaVinci Resolve</li>
                  <li>Logic Pro</li>
                  <li>SuperCollider</li>
                </ul>
              </div>
              <a href="/media/dark-knites-logo.mp4" target="_blank" rel="noopener noreferrer">
                Open video <span aria-hidden="true">↗</span>
              </a>
            </figcaption>
          </figure>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default ArtHomePage;
