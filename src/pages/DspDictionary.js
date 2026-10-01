import { DspMotion, DspReveal } from "../components/common/DspMotion";
import GainDemo from "../components/common/GainDemo";
import DspConceptDemo from "../components/common/DspConceptDemo";
import PageSeo from "../components/common/PageSeo";
import Footer from "../components/layout/Footer";
import { pageMetadata } from "../config/site";
import { dspStructuredData } from "../config/prerender";
import { dspBrief, dspConceptGroups } from "../data/dspBrief";

const topics = dspConceptGroups.flatMap((group) => group.topics);

export function DspDictionaryContent({ embedded = false }) {
  const Heading = embedded ? "h2" : "h1";
  const topicHeadingLevel = embedded ? 3 : 2;
  const Container = embedded ? "section" : "main";
  return (
      <Container id="dsp-dictionary-page" aria-labelledby="dictionary-heading">
        <DspReveal as="section" className="dictionary-hero">
          <div className="dictionary-shell">
            <Heading id="dictionary-heading"><span id="dsp-dictionary" />DSP Dictionary</Heading>
          </div>
        </DspReveal>

        <section className="dictionary-navigation" aria-label="Concept navigation">
          <div className="dictionary-shell">
            <details id="dictionary-topics" className="dictionary-concept-index">
              <summary>Concepts <span>{topics.length}</span></summary>
              <nav className="dictionary-index-groups" aria-label="DSP concepts">
                {dspConceptGroups.map((group) => (
                  <div key={group.title} className="dictionary-index-group">
                    <h3>{group.title}</h3>
                    <ul>{group.topics.map((topic) => <li key={topic.id}><a href={`#${topic.id}`}>{topic.title}</a></li>)}</ul>
                  </div>
                ))}
              </nav>
            </details>
          </div>
        </section>

        <section className="dictionary-content">
          <div className="dictionary-shell dictionary-concepts">
            {topics.map((topic) => (
              <DspReveal as="article" key={topic.id} id={topic.id} className="dictionary-concept">
                {topic.id === "gain"
                  ? <GainDemo compact headingLevel={topicHeadingLevel} title={topic.title} description={dspBrief.gain.sentence} />
                  : <DspConceptDemo compact topicId={topic.id} headingLevel={topicHeadingLevel} title={topic.title} description={dspBrief[topic.id].sentence} />}
              </DspReveal>
            ))}
          </div>
        </section>
      </Container>
  );
}

export default function DspDictionary() {
  return <DspMotion><PageSeo {...pageMetadata.dspDictionary} structuredData={dspStructuredData} /><DspDictionaryContent /><Footer /></DspMotion>;
}
