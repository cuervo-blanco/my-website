import { motion, useReducedMotion } from "motion/react";
import PageSeo from "../components/common/PageSeo";
import Footer from "../components/layout/Footer";
import { pageMetadata } from "../config/site";
import { dspStructuredData } from "../config/prerender";
import {
  dspDictionaryOverview,
  dspDictionaryReferenceIntro,
  dspDictionarySections,
  dspDictionaryTopicGroups,
} from "../data/dspDictionary";

function DspDictionary() {
  const shouldReduceMotion = useReducedMotion();
  const viewport = { once: true, amount: 0.18 };

  const revealVariants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 24,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.48,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const staggerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.08,
        delayChildren: shouldReduceMotion ? 0 : 0.05,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 18,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.35,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const renderParagraphs = (paragraphs, keyPrefix) => (
    <motion.div variants={staggerVariants} className="dictionary-prose">
      {paragraphs.map((paragraph, index) => (
        <motion.p key={`${keyPrefix}-${index}`} variants={revealVariants}>
          {paragraph}
        </motion.p>
      ))}
    </motion.div>
  );

  return (
    <>
      <PageSeo
        {...pageMetadata.dspDictionary}
        structuredData={dspStructuredData}
      />
      <main id="dsp-dictionary-page">
        <motion.section
          className="dictionary-hero"
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={staggerVariants}
        >
          <div className="dictionary-shell">
            <motion.p className="dictionary-eyebrow" variants={revealVariants}>
              DSP, plugins, and systems design
            </motion.p>
            <motion.h1 variants={revealVariants}>{dspDictionaryOverview.title}</motion.h1>
            <motion.p className="dictionary-subtitle" variants={revealVariants}>
              {dspDictionaryOverview.subtitle}
            </motion.p>
            <motion.p className="dictionary-intro" variants={revealVariants}>
              {dspDictionaryOverview.intro}
            </motion.p>
          </div>
        </motion.section>

        <motion.section
          className="dictionary-navigation"
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={staggerVariants}
        >
          <div className="dictionary-shell">
            <motion.div className="dictionary-card-grid" variants={staggerVariants}>
              {dspDictionarySections.map((section) => (
                <motion.a
                  key={section.id}
                  className="dictionary-card"
                  href={`#${section.id}`}
                  variants={cardVariants}
                >
                  <span className="dictionary-card-label">{section.title}</span>
                  <span className="dictionary-card-copy">{section.summary}</span>
                </motion.a>
              ))}
              <motion.a
                className="dictionary-card"
                href="#dictionary-topics"
                variants={cardVariants}
              >
                <span className="dictionary-card-label">Concept Index</span>
                <span className="dictionary-card-copy">
                  Jump across DSP topics: filtering, dynamics, modulation, distortion,
                  spatial processing, and mix fundamentals.
                </span>
              </motion.a>
            </motion.div>
          </div>
        </motion.section>

        <section className="dictionary-content">
          <div className="dictionary-shell dictionary-layout">
            <motion.aside
              className="dictionary-sidebar"
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              variants={staggerVariants}
            >
              <motion.div className="dictionary-sidebar-panel" variants={staggerVariants}>
                <motion.h2 id="dictionary-topics" variants={revealVariants}>
                  Concept Index
                </motion.h2>
                {dspDictionaryTopicGroups.map((group) => (
                  <motion.div
                    key={group.title}
                    className="dictionary-topic-group"
                    variants={cardVariants}
                  >
                    <h3>{group.title}</h3>
                    <ul>
                      {group.topics.map((topic) => (
                        <li key={topic.id}>
                          <a href={`#${topic.id}`}>{topic.title}</a>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </motion.div>
            </motion.aside>

            <div className="dictionary-main">
              {dspDictionarySections.map((section) => (
                <motion.article
                  key={section.id}
                  id={section.id}
                  className="dictionary-section"
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewport}
                  variants={staggerVariants}
                >
                  <motion.header className="dictionary-section-header" variants={staggerVariants}>
                    <motion.p className="dictionary-section-kicker" variants={revealVariants}>
                      Foundations
                    </motion.p>
                    <motion.h2 variants={revealVariants}>{section.title}</motion.h2>
                  </motion.header>
                  {renderParagraphs(section.paragraphs, section.id)}
                </motion.article>
              ))}

              <motion.article
                id="dsp-dictionary"
                className="dictionary-section"
                initial="hidden"
                whileInView="visible"
                viewport={viewport}
                variants={staggerVariants}
              >
                <motion.header className="dictionary-section-header" variants={staggerVariants}>
                  <motion.p className="dictionary-section-kicker" variants={revealVariants}>
                    Reference
                  </motion.p>
                  <motion.h2 variants={revealVariants}>
                    An Audio DSP Very Informal Dictionary
                  </motion.h2>
                </motion.header>
                {renderParagraphs(dspDictionaryReferenceIntro, "reference-intro")}

                {dspDictionaryTopicGroups.map((group) => (
                  <motion.section
                    key={group.title}
                    className="dictionary-topic-cluster"
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewport}
                    variants={staggerVariants}
                  >
                    <motion.h3 variants={revealVariants}>{group.title}</motion.h3>
                    {group.topics.map((topic) => (
                      <motion.section
                        key={topic.id}
                        id={topic.id}
                        className="dictionary-topic"
                        initial="hidden"
                        whileInView="visible"
                        viewport={viewport}
                        variants={staggerVariants}
                      >
                        <motion.h4 variants={revealVariants}>{topic.title}</motion.h4>
                        {renderParagraphs(topic.body, topic.id)}
                        {topic.code ? (
                          <motion.pre className="dictionary-code" variants={revealVariants}>
                            <code>{topic.code}</code>
                          </motion.pre>
                        ) : null}
                      </motion.section>
                    ))}
                  </motion.section>
                ))}
              </motion.article>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default DspDictionary;
