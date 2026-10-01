import Footer from "../components/layout/Footer";
import Hero from "../components/layout/Hero";
import Reel from "../components/sections/Reel.tsx";
import FilmCredits from "../components/sections/FilmCredits";
import Portfolio from "../components/sections/Portfolio";
import RecentClients from "../components/sections/RecentClients";
import LiveCredits from "../components/sections/LiveCredits";
import PageSeo from "../components/common/PageSeo";
import { pageMetadata, siteMetadata } from "../config/site";
import { workStructuredData } from "../config/prerender";
import "../assets/styles/work.css";

function FilmHomePage() {
  return (
    <>
      <PageSeo {...pageMetadata.film} structuredData={workStructuredData} />
      <main id="homepage" className="site-home site-home--film work-page">
        <Hero compact />
        <FilmCredits />
        <div className="work-page__shell work-page__reel">
          <details>
            <summary>Sound reel</summary>
            <Reel storagePath={siteMetadata.reelStoragePath} />
          </details>
        </div>
        <Portfolio compact showTechnicalSection={false} />
        <RecentClients compact />
        <LiveCredits />
      </main>
      <Footer />
    </>
  );
}

export default FilmHomePage;
