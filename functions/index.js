const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const { defineSecret } = require("firebase-functions/params");

const { createDatabase } = require("./licensing/database");
const { createLicensingApp } = require("./licensing/app");

const WEB3FORMS_ACCESS_KEY = defineSecret("WEB3FORMS_ACCESS_KEY");
const LICENSING_DATABASE_URL = defineSecret("LICENSING_DATABASE_URL");
const LICENSING_ADMIN_TOKEN = defineSecret("LICENSING_ADMIN_TOKEN");
const DIDICOMPENSATE_PRIVATE_KEY = defineSecret("DIDICOMPENSATE_PRIVATE_KEY");
const DIDICOMPENSATE_PUBLIC_KEY = defineSecret("DIDICOMPENSATE_PUBLIC_KEY");

let licensingDatabase;

function getLicensingDatabase() {
  if (!licensingDatabase) {
    licensingDatabase = createDatabase(LICENSING_DATABASE_URL.value());
  }

  return licensingDatabase;
}

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

exports.licensing = onRequest(
  {
    cors: true,
    secrets: [
      LICENSING_DATABASE_URL,
      LICENSING_ADMIN_TOKEN,
      DIDICOMPENSATE_PRIVATE_KEY,
      DIDICOMPENSATE_PUBLIC_KEY,
    ],
  },
  (request, response) => {
    const app = createLicensingApp({
      config: {
        adminToken: LICENSING_ADMIN_TOKEN.value(),
        productId: process.env.DIDICOMPENSATE_PRODUCT_ID || "didi-compensate",
        privateKey: DIDICOMPENSATE_PRIVATE_KEY.value(),
        publicKey: DIDICOMPENSATE_PUBLIC_KEY.value(),
        defaultLeaseDurationDays: Number.parseInt(
          process.env.DEFAULT_LEASE_DURATION_DAYS || "14",
          10
        ),
      },
      database: getLicensingDatabase(),
      logger,
    });

    return app(request, response);
  }
);
