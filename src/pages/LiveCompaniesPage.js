import PageSeo from "../components/common/PageSeo";
import Footer from "../components/layout/Footer";
import SectionSiteHero from "../components/layout/SectionSiteHero";
import RecentClients from "../components/sections/RecentClients";
import { pageMetadata } from "../config/site";

function LiveCompaniesPage() {
  return (
    <>
      <PageSeo {...pageMetadata.liveCompanies} />
      <main className="section-site-page">
        <SectionSiteHero title="Companies" />
        <RecentClients showHeading={false} />
      </main>
      <Footer />
    </>
  );
}

export default LiveCompaniesPage;
