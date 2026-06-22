const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const { defineSecret } = require("firebase-functions/params");

const WEB3FORMS_ACCESS_KEY = defineSecret("WEB3FORMS_ACCESS_KEY");

exports.contact = onRequest(
  {
    cors: true,
    secrets: [WEB3FORMS_ACCESS_KEY],
  },
  async (request, response) => {
    if (request.method !== "POST") {
      response.status(405).json({ message: "Method not allowed." });
      return;
    }

    const { company, name, email, subject, message } = request.body || {};

    if (company) {
      response.status(400).json({ message: "Submission blocked." });
      return;
    }

    if (!name || !email || !subject || !message) {
      response.status(400).json({
        message: "Name, email, subject, and message are required.",
      });
      return;
    }

    try {
      const web3formsResponse = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY.value(),
          name,
          email,
          subject,
          message,
        }),
      });

      const result = await web3formsResponse.json();

      if (!web3formsResponse.ok || !result.success) {
        logger.error("Web3Forms submission failed.", result);
        response.status(502).json({
          message: "Unable to forward your message right now.",
        });
        return;
      }

      response.status(200).json({
        message: "Your message has been sent successfully.",
      });
    } catch (error) {
      logger.error("Contact function failed.", error);
      response.status(500).json({
        message: "Something went wrong while sending your message.",
      });
    }
  }
);
