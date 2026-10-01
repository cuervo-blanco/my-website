import { Link } from "react-router-dom";
import PageSeo from "../components/common/PageSeo";
import Footer from "../components/layout/Footer";
import { homeStructuredData } from "../config/prerender";
import { pageMetadata } from "../config/site";
import { gatewayCards, getSiteRoute } from "../config/siteSections";

function SiteGatewayPage() {
  return (
    <>
      <PageSeo {...pageMetadata.home} structuredData={homeStructuredData} />
      <main id="site-gateway-page">
        <section className="site-gateway-hero">
          <div className="section-site-shell">
            <p className="section-site-eyebrow">Jaime Osvaldo</p>
            <h1>Film, live sound, software, and art.</h1>
            <p className="section-site-subtitle">
              Sound mixer, sound designer, and audio programmer based in New York.
            </p>
            <p className="section-site-intro">
              Explore my film credits and sound work, theatre and live production,
              audio software, and animation.
            </p>
          </div>
        </section>

        <section className="site-gateway-grid-section">
          <div className="section-site-shell">
            <div className="site-gateway-grid">
              {gatewayCards.map((card) => (
                <Link
                  key={card.siteKey}
                  className="site-gateway-card"
                  to={getSiteRoute(card.siteKey)}
                >
                  <p className="site-gateway-card-eyebrow">{card.eyebrow}</p>
                  <h2>{card.title}</h2>
                  <p>{card.description}</p>
                  <span>Open site</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default SiteGatewayPage;
