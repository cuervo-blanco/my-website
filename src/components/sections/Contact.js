import { useState } from "react";
import soundStuff from "../../assets/img/sound-stuff.webp";
import contactBackground from "../../assets/img/contact-background.jpg";
import { contactSubjects, siteMetadata } from "../../config/site";

function Contact() {
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

      if (!response.ok) {
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
              <p className="contact-note">
                Replies go to <a href={`mailto:${siteMetadata.email}`}>{siteMetadata.email}</a>.
              </p>
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
