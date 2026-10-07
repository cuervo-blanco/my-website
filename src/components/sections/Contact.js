import { useState } from "react";
import soundStuff from "../../assets/img/sound-stuff.webp";
import contactBackground from "../../assets/img/contact-background.jpg";
import { contactIntro, contactSubjects, siteMetadata } from "../../config/site";

function Contact({ compact = false, standalone = false }) {
  const [status, setStatus] = useState({
    type: "idle",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const payload = Object.fromEntries(formData.entries());
    const requestBody = {
      ...payload,
      ...(siteMetadata.contactEndpoint.includes("web3forms.com")
        ? { access_key: siteMetadata.web3FormsAccessKey }
        : {}),
    };

    if (payload.company) {
      setStatus({
        type: "error",
        message: "Submission blocked.",
      });
      return;
    }

    setIsSubmitting(true);
    setStatus({
      type: "info",
      message: "Sending your message...",
    });

    try {
      const response = await fetch(siteMetadata.contactEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok || result.success === false) {
        throw new Error(result.message || "Unable to send your message right now.");
      }

      setStatus({
        type: "success",
        message:
          result.message || "Your message has been sent successfully.",
      });
      event.target.reset();
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error.message || "Something went wrong. Please try again in a moment.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (compact) {
    const Heading = standalone ? "h1" : "h2";
    const FormContainer = standalone ? "div" : "details";
    return (
      <section id="contact" className="compact-contact surface-panel" aria-labelledby="contact-heading">
        {standalone ? <p className="studio-kicker">Enquiries</p> : null}
        <Heading id="contact-heading">Contact</Heading>
        {standalone ? <p className="studio-page-tagline">Film, theatre, software, and animation.</p> : null}
        {standalone ? <p className="service-intro">Based in New York.</p> : null}
        {siteMetadata.email ? <a className="compact-contact__email" href={`mailto:${siteMetadata.email}`} aria-label="Email">{siteMetadata.email} ↗</a> : null}
        <FormContainer className="compact-contact__form">
          {standalone ? null : <summary>Send a message</summary>}
          {status.message ? <p role="status" className={`status-${status.type}`}>{status.message}</p> : null}
          <form onSubmit={handleSubmit}>
            <input type="hidden" name="subject" value="Portfolio enquiry" />
            <div className="honeypot-field" aria-hidden="true">
              <label htmlFor="contact-company">Company</label>
              <input id="contact-company" type="text" name="company" tabIndex="-1" autoComplete="off" />
            </div>
            <div className="compact-contact__fields">
              <label htmlFor="contact-name">Name<input id="contact-name" name="name" autoComplete="name" required /></label>
              <label htmlFor="contact-email">Email<input id="contact-email" type="email" name="email" autoComplete="email" required /></label>
            </div>
            <label htmlFor="contact-message">Message<textarea id="contact-message" name="message" rows="5" placeholder="Project details, dates, and any relevant links." required /></label>
            <button type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>{isSubmitting ? "Sending…" : "Send"} <span aria-hidden="true">↗</span></button>
          </form>
        </FormContainer>
      </section>
    );
  }

  return (
    <section id="contact">
      <div id="contact-back-container">
        <div id="contact-background">
          <img
            src={contactBackground}
            alt="Background of constellations of a monkey and a chicken"
            loading="lazy"
          />
        </div>
      </div>
      <h2>Contact</h2>
      <p className="contact-intro">{contactIntro}</p>
      <div id="contact-window">
        {status.message && (
          <div
            id="submission-message"
            className={`status-${status.type}`}
            aria-live="polite"
          >
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div id="inputs">
            <div className="form-input honeypot-field">
              <label htmlFor="company">Company</label>
              <input
                type="text"
                id="company"
                name="company"
                tabIndex="-1"
                autoComplete="off"
              />
            </div>

            <div className="form-input">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                autoComplete="name"
                required
              />
            </div>

            <div className="form-input">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                autoComplete="email"
                required
              />
            </div>

            <div className="form-input">
              <label htmlFor="subject">Subject</label>
              <select id="subject" name="subject" defaultValue="production-sound" required>
                {contactSubjects.map((subject) => (
                  <option key={subject.value} value={subject.value}>
                    {subject.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div id="message-column">
            <div className="form-input2">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                rows="6"
                autoComplete="off"
                required
              ></textarea>
            </div>

            <div className="form-input2">
              <button type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>
                {isSubmitting ? "Sending..." : "Submit"}
              </button>
              {siteMetadata.email ? <p className="contact-note">
                Replies go to <a href={`mailto:${siteMetadata.email}`}>{siteMetadata.email}</a>.
              </p> : null}
            </div>
          </div>
        </form>
      </div>

      <div id="contact-footer">
        <img src={soundStuff} alt="Sound equipment doodle" loading="lazy" />
      </div>
    </section>
  );
}

export default Contact;
