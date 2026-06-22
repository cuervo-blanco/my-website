import Hero from "../components/layout/Hero";
import Services from "../components/sections/Services";
import Reel from "../components/sections/Reel.tsx";
import ResumeButton from "../components/sections/Resume";
import Contact from "../components/sections/Contact";
import Footer from "../components/layout/Footer";
import PageSeo from "../components/common/PageSeo";
import { pageMetadata, siteMetadata } from "../config/site";
import { homeStructuredData } from "../config/prerender";

function Home() {
  return (
    <>
      <PageSeo {...pageMetadata.home} structuredData={homeStructuredData} />
      <main id="homepage">
        <Hero />
        <Services />
        <div>
          <Reel
            storagePath={siteMetadata.reelStoragePath}
            width={1920}
            height={1080}
          />
        </div>
        <ResumeButton />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default Home;
