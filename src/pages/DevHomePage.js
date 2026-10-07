import PageSeo from "../components/common/PageSeo";
import Footer from "../components/layout/Footer";
import { pageMetadata } from "../config/site";
import { softwareStructuredData } from "../config/prerender";
import { DspDictionaryContent } from "./DspDictionary";
import { DspMotion } from "../components/common/DspMotion";
import { githubProfileUrl } from "../data/software";
import "../assets/styles/dev-work.css";

function DevHomePage() {
  return (
    <DspMotion>
      <PageSeo {...pageMetadata.devHome} structuredData={softwareStructuredData} />
      <main className="section-site-page dev-site-page">
        <div className="section-site-shell dev-intro surface-panel">
          <header className="dev-work-header">
            <p className="studio-kicker">Sound, under the hood</p>
            <h1>Dev</h1>
            <p className="studio-page-tagline">A playground for your ears. And your brain.</p>
          </header>
          <nav className="dev-work-links" aria-label="Dev work">
            <a href={githubProfileUrl} target="_blank" rel="noopener noreferrer">
              GitHub <span aria-hidden="true">↗</span>
            </a>
          </nav>
          <p className="service-intro">Software developer &amp; audio programmer in New York. Audio tools, DSP &amp; interactive sound.</p>
        </div>
        <DspDictionaryContent embedded />
      </main>
      <Footer />
    </DspMotion>
  );
}

export default DevHomePage;
