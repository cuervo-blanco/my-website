import PageSeo from "../components/common/PageSeo";
import Footer from "../components/layout/Footer";
import SectionSiteHero from "../components/layout/SectionSiteHero";
import Contact from "../components/sections/Contact";
import Services from "../components/sections/Services";
import { pageMetadata } from "../config/site";
import { getSiteRoute } from "../config/siteSections";
import { serviceCategories } from "../data/services";

function LiveHomePage() {
  const liveCategories = serviceCategories.filter(
    (category) => category.title === "Live Event / Theatre Audio"
  );

  return (
    <>
      <PageSeo {...pageMetadata.live} />
      <main className="section-site-page">
        <SectionSiteHero
          eyebrow="Live / Theatre"
          title="Theatre, festivals, and live-event audio"
          subtitle="Sound design, mixing, and show support for theatre, festivals, school productions, and live events."
          intro="From rehearsals to the final performance, I help productions build clear, reliable sound. Explore selected work and the companies I have worked with."
          actions={[
            { label: "See Companies", to: getSiteRoute("live", "/companies") },
            { label: "See Live Work", to: `${getSiteRoute("live")}#services` },
            { label: "Contact Me", to: `${getSiteRoute("live")}#contact` },
          ]}
        />
        <Services
          title="Live Work"
          intro="A live-focused selection of theatre, festival, school, and event audio work."
          categories={liveCategories}
        />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default LiveHomePage;
