import Button from "../components/common/Button";
import PageSeo from "../components/common/PageSeo";
import SoftwareProjectCard from "../components/common/SoftwareProjectCard";
import Footer from "../components/layout/Footer";
import {
  softwareAudience,
  softwareBuildAreas,
  softwareProjects,
  softwareServices,
} from "../data/software";
import { pageMetadata } from "../config/site";
import { getSiteRoute } from "../config/siteSections";
import { softwareStructuredData } from "../config/prerender";

function SoftwarePage() {
  const contactLink = `${getSiteRoute("dev")}#contact`;

  return (
    <>
      <PageSeo
        {...pageMetadata.software}
        structuredData={softwareStructuredData}
      />
      <main id="software-page">
        <section className="software-page-hero">
          <div className="software-page-shell">
            <p className="software-page-eyebrow">Audio Software</p>
            <h1>Audio Software & DSP Tools</h1>
            <p className="software-page-subtitle">
              Custom tools, plugins, and technical systems for people working
              with sound.
            </p>
            <p className="software-page-intro">
              This work is grounded in production sound, theatre, live audio,
              and post-production practice. The focus is not software for its
              own sake. The focus is building practical tools for real-world
              audio workflows.
            </p>
          </div>
        </section>

        <section className="software-page-section" aria-labelledby="software-build-heading">
          <div className="software-page-shell">
            <header className="software-section-header">
              <p className="software-page-kicker">What I Build</p>
              <h2 id="software-build-heading">What I Build</h2>
              <p>
                The work ranges from focused plugin ideas to utilities that
                reduce repetitive production tasks and help sound teams move
                faster with fewer errors.
              </p>
            </header>

            <ul className="software-pill-grid">
              {softwareBuildAreas.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="software-page-section" aria-labelledby="software-projects-heading">
          <div className="software-page-shell">
            <header className="software-section-header">
              <p className="software-page-kicker">Current / Featured Projects</p>
              <h2 id="software-projects-heading">Current / Featured Projects</h2>
              <p>
                These are the clearest examples of how the software side of the
                site connects back to production-focused audio work.
              </p>
            </header>

            <div className="software-project-grid">
              {softwareProjects.map((project) => (
                <SoftwareProjectCard key={project.title} {...project} />
              ))}
            </div>
          </div>
        </section>

        <section className="software-page-section" aria-labelledby="software-services-heading">
          <div className="software-page-shell">
            <header className="software-section-header">
              <p className="software-page-kicker">Services</p>
              <h2 id="software-services-heading">Services</h2>
              <p>
                The software work can stand alone as consulting, or it can be
                part of a larger production, post-production, or theatre audio
                process.
              </p>
            </header>

            <div className="software-services-grid">
              {softwareServices.map((service) => (
                <article key={service} className="software-service-card">
                  <h3>{service}</h3>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="software-page-section" aria-labelledby="software-audience-heading">
          <div className="software-page-shell">
            <header className="software-section-header">
              <p className="software-page-kicker">Who This Is For</p>
              <h2 id="software-audience-heading">Who This Is For</h2>
              <p>
                The people I have in mind are working professionals who need
                tools that fit actual sound workflows, not abstract demos.
              </p>
            </header>

            <ul className="software-audience-grid">
              {softwareAudience.map((audience) => (
                <li key={audience}>{audience}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="software-page-section software-cta-band">
          <div className="software-page-shell">
            <div className="software-cta-card">
              <p className="software-page-kicker">Contact</p>
              <h2>Have an audio workflow problem?</h2>
              <p>
                Reach out if you need help shaping a plugin idea, reviewing a
                DSP approach, or building a practical utility around a recurring
                audio task.
              </p>
              <Button buttonText="Contact Me" buttonLink={contactLink} />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default SoftwarePage;
