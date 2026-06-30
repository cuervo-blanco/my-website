const express = require("express");

const { requireAdmin } = require("./adminAuth");
const { createActivationRepository } = require("./activationRepository");
const { createLicenseRepository } = require("./licenseRepository");
const { issueSignedLicense, verifySignedLicense } = require("./signedLicense");

function parseBodyNumber(value, fallbackValue) {
  const parsedValue = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsedValue) && parsedValue > 0
    ? parsedValue
    : fallbackValue;
}

function normalizeIsoDate(dateValue) {
  if (!dateValue) {
    return null;
  }

  const date = new Date(dateValue);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function sendValidationError(response, message) {
  response.status(400).json({
    ok: false,
    error: "validation_error",
    message,
  });
}

function buildActivationRequestFromBody(body) {
  return {
    licenseCode: `${body.licenseCode ?? ""}`.trim(),
    machineId: `${body.machineId ?? ""}`.trim(),
    machineLabel: `${body.machineLabel ?? ""}`.trim(),
    productId: `${body.productId ?? ""}`.trim(),
    appVersion: `${body.appVersion ?? ""}`.trim(),
    metadata:
      body.metadata && typeof body.metadata === "object" ? body.metadata : {},
  };
}

function buildActivationUpdateFromBody(body) {
  return {
    machineLabel: `${body.machineLabel ?? ""}`.trim(),
    appVersion: `${body.appVersion ?? ""}`.trim(),
    metadata:
      body.metadata && typeof body.metadata === "object" ? body.metadata : {},
  };
}

function issueLeaseForLicense(config, { license, machineId, leaseExpiresAt }) {
  return issueSignedLicense(
    {
      productId: license.product_id,
      licenseId: license.license_code,
      licenseeEmail: license.customer_email,
      licenseeName: license.customer_name,
      machineId,
      features: license.features ?? [],
      issuedAtMs: Date.now(),
      expiresAtMs: new Date(leaseExpiresAt).getTime(),
    },
    config.privateKey
  );
}

function verifyLeaseFromBody(body, publicKeyText) {
  if (!publicKeyText) {
    return {
      ok: false,
      status: 503,
      error: "verification_unavailable",
      message: "The public verification key is not configured on the server.",
    };
  }

  if (!body?.signedLicense || typeof body.signedLicense !== "object") {
    return {
      ok: false,
      status: 400,
      error: "validation_error",
      message: "signedLicense is required.",
    };
  }

  const verification = verifySignedLicense(body.signedLicense, publicKeyText);
  if (!verification.ok) {
    return {
      ok: false,
      status: 403,
      error: "invalid_signed_license",
      message: verification.message,
    };
  }

  const { payload } = verification.envelope;
  if (!payload.licenseId || !payload.machineId) {
    return {
      ok: false,
      status: 400,
      error: "validation_error",
      message:
        "The signed license does not include a licenseId and machineId.",
    };
  }

  return {
    ok: true,
    envelope: verification.envelope,
  };
}

function registerRoutes(router, { config, database, logger }) {
  const adminOnly = requireAdmin(config);
  const licenses = createLicenseRepository(database);
  const activations = createActivationRepository(database);

  router.get("/health", (_request, response) => {
    response.json({
      ok: true,
      service: "didi-compensate-licensing",
      databaseConfigured: database.configured,
      signingConfigured: Boolean(config.privateKey && config.publicKey),
      productId: config.productId,
    });
  });

  router.post("/v1/licenses/issue", adminOnly, async (request, response) => {
    try {
      if (!database.configured) {
        response.status(503).json({
          ok: false,
          error: "database_unavailable",
          message: "LICENSING_DATABASE_URL is not configured.",
        });
        return;
      }

      const customerEmail = `${request.body.customerEmail ?? ""}`.trim();
      const customerName = `${request.body.customerName ?? ""}`.trim();

      if (!customerEmail || !customerName) {
        sendValidationError(
          response,
          "customerEmail and customerName are required."
        );
        return;
      }

      const license = await licenses.issueLicense({
        productId:
          `${request.body.productId ?? ""}`.trim() || config.productId,
        customerEmail,
        customerName,
        expiresAt:
          normalizeIsoDate(request.body.expiresAt) ??
          (request.body.expiresInDays
            ? new Date(
                Date.now() +
                  parseBodyNumber(request.body.expiresInDays, 30) * 86400000
              ).toISOString()
            : null),
        maxActivations: parseBodyNumber(request.body.maxActivations, 1),
        leaseDurationDays: parseBodyNumber(
          request.body.leaseDurationDays,
          config.defaultLeaseDurationDays
        ),
        boundMachineId: `${request.body.boundMachineId ?? ""}`.trim(),
        features: Array.isArray(request.body.features)
          ? request.body.features
          : [],
        notes: `${request.body.notes ?? ""}`,
        metadata:
          request.body.metadata && typeof request.body.metadata === "object"
            ? request.body.metadata
            : {},
        licenseCode: `${request.body.licenseCode ?? ""}`,
      });

      response.status(201).json({ ok: true, license });
    } catch (error) {
      logger?.error?.("License issue failed.", error);
      response
        .status(500)
        .json({ ok: false, error: "issue_failed", message: error.message });
    }
  });

  router.get(
    "/v1/licenses/:licenseCode",
    adminOnly,
    async (request, response) => {
      try {
        const license = await licenses.findLicenseByCode(
          request.params.licenseCode
        );

        if (!license) {
          response.status(404).json({
            ok: false,
            error: "license_not_found",
            message: "License was not found.",
          });
          return;
        }

        const activationRows = await licenses.listActivationsForLicense(
          license.id
        );
        response.json({ ok: true, license, activations: activationRows });
      } catch (error) {
        logger?.error?.("License lookup failed.", error);
        response
          .status(500)
          .json({ ok: false, error: "lookup_failed", message: error.message });
      }
    }
  );

  router.post(
    "/v1/licenses/:licenseCode/revoke",
    adminOnly,
    async (request, response) => {
      try {
        const license = await licenses.revokeLicense(
          request.params.licenseCode,
          `${request.body.reason ?? ""}`.trim()
        );

        if (!license) {
          response.status(404).json({
            ok: false,
            error: "license_not_found",
            message: "License was not found.",
          });
          return;
        }

        response.json({ ok: true, license });
      } catch (error) {
        logger?.error?.("License revoke failed.", error);
        response
          .status(500)
          .json({ ok: false, error: "revoke_failed", message: error.message });
      }
    }
  );

  async function issueLeaseResponse(response, {
    activationRequest,
    requireExistingActivation,
  }) {
    if (!database.configured) {
      response.status(503).json({
        ok: false,
        error: "database_unavailable",
        message: "LICENSING_DATABASE_URL is not configured.",
      });
      return;
    }

    if (!config.privateKey) {
      response.status(503).json({
        ok: false,
        error: "signing_unavailable",
        message: "The private signing key is not configured on the server.",
      });
      return;
    }

    if (!activationRequest.licenseCode || !activationRequest.machineId) {
      sendValidationError(response, "licenseCode and machineId are required.");
      return;
    }

    const license = await licenses.findLicenseByCode(
      activationRequest.licenseCode
    );
    if (!license) {
      response.status(404).json({
        ok: false,
        error: "license_not_found",
        message: "License code was not found.",
      });
      return;
    }

    if (
      activationRequest.productId &&
      activationRequest.productId !== license.product_id
    ) {
      response.status(403).json({
        ok: false,
        error: "wrong_product",
        message: "This license code belongs to a different product.",
      });
      return;
    }

    if (license.status !== "active") {
      response.status(403).json({
        ok: false,
        error: "license_inactive",
        message: `License status is ${license.status}.`,
      });
      return;
    }

    if (license.expires_at && new Date(license.expires_at).getTime() < Date.now()) {
      response.status(403).json({
        ok: false,
        error: "license_expired",
        message: "This license has expired.",
      });
      return;
    }

    if (
      license.bound_machine_id &&
      license.bound_machine_id !== activationRequest.machineId
    ) {
      response.status(403).json({
        ok: false,
        error: "wrong_machine",
        message: "This license is bound to a different machine.",
      });
      return;
    }

    const existingActivation = await activations.findActivation(
      license.id,
      activationRequest.machineId
    );

    if (
      requireExistingActivation &&
      (!existingActivation || existingActivation.status !== "active")
    ) {
      response.status(404).json({
        ok: false,
        error: "activation_not_found",
        message: "This machine does not have an active lease to refresh.",
      });
      return;
    }

    if (!existingActivation || existingActivation.status !== "active") {
      const activeCount = await activations.countActiveActivations(license.id);
      if (activeCount >= license.max_activations) {
        response.status(403).json({
          ok: false,
          error: "activation_limit_reached",
          message: "This license has reached its activation limit.",
        });
        return;
      }
    }

    const now = Date.now();
    const requestedLeaseExpiry =
      now + license.lease_duration_days * 86400000;
    const hardExpiry = license.expires_at
      ? new Date(license.expires_at).getTime()
      : null;
    const leaseExpiresAt = new Date(
      hardExpiry ? Math.min(requestedLeaseExpiry, hardExpiry) : requestedLeaseExpiry
    ).toISOString();

    const activation = await activations.upsertActivation({
      licenseId: license.id,
      machineId: activationRequest.machineId,
      machineLabel: activationRequest.machineLabel,
      appVersion: activationRequest.appVersion,
      leaseExpiresAt,
      metadata: activationRequest.metadata,
    });

    const signedLicense = issueLeaseForLicense(config, {
      license,
      machineId: activationRequest.machineId,
      leaseExpiresAt,
    });

    response.json({
      ok: true,
      license: {
        code: license.license_code,
        productId: license.product_id,
        customerEmail: license.customer_email,
        customerName: license.customer_name,
        features: license.features ?? [],
      },
      activation: {
        id: activation.id,
        machineId: activation.machine_id,
        machineLabel: activation.machine_label,
        leaseExpiresAt: activation.lease_expires_at,
      },
      signedLicense,
    });
  }

  router.post("/v1/activations/request", async (request, response) => {
    try {
      await issueLeaseResponse(response, {
        activationRequest: buildActivationRequestFromBody(request.body),
        requireExistingActivation: false,
      });
    } catch (error) {
      logger?.error?.("Activation request failed.", error);
      response.status(500).json({
        ok: false,
        error: "activation_failed",
        message: error.message,
      });
    }
  });

  router.post("/v1/activations/refresh", async (request, response) => {
    try {
      const verifiedLease = verifyLeaseFromBody(request.body, config.publicKey);
      if (!verifiedLease.ok) {
        response.status(verifiedLease.status).json({
          ok: false,
          error: verifiedLease.error,
          message: verifiedLease.message,
        });
        return;
      }

      const activationUpdate = buildActivationUpdateFromBody(request.body);
      await issueLeaseResponse(response, {
        activationRequest: {
          licenseCode: verifiedLease.envelope.payload.licenseId,
          machineId: verifiedLease.envelope.payload.machineId,
          machineLabel: activationUpdate.machineLabel,
          productId: verifiedLease.envelope.payload.productId,
          appVersion: activationUpdate.appVersion,
          metadata: activationUpdate.metadata,
        },
        requireExistingActivation: true,
      });
    } catch (error) {
      logger?.error?.("Activation refresh failed.", error);
      response.status(500).json({
        ok: false,
        error: "refresh_failed",
        message: error.message,
      });
    }
  });

  router.post("/v1/activations/release", async (request, response) => {
    try {
      if (!database.configured) {
        response.status(503).json({
          ok: false,
          error: "database_unavailable",
          message: "LICENSING_DATABASE_URL is not configured.",
        });
        return;
      }

      const verifiedLease = verifyLeaseFromBody(request.body, config.publicKey);
      if (!verifiedLease.ok) {
        response.status(verifiedLease.status).json({
          ok: false,
          error: verifiedLease.error,
          message: verifiedLease.message,
        });
        return;
      }

      const { licenseId, machineId, productId } = verifiedLease.envelope.payload;
      const license = await licenses.findLicenseByCode(licenseId);
      if (!license) {
        response.status(404).json({
          ok: false,
          error: "license_not_found",
          message: "License code was not found.",
        });
        return;
      }

      if (productId && productId !== license.product_id) {
        response.status(403).json({
          ok: false,
          error: "wrong_product",
          message: "This signed lease belongs to a different product.",
        });
        return;
      }

      const activation = await activations.releaseActivation(
        license.id,
        machineId
      );
      if (!activation) {
        response.status(404).json({
          ok: false,
          error: "activation_not_found",
          message: "No activation exists for this machine.",
        });
        return;
      }

      response.json({ ok: true, activation });
    } catch (error) {
      logger?.error?.("Activation release failed.", error);
      response.status(500).json({
        ok: false,
        error: "release_failed",
        message: error.message,
      });
    }
  });
}

function createLicensingApp({ config, database, logger }) {
  const app = express();
  const router = express.Router();

  app.use(express.json({ limit: "1mb" }));

  registerRoutes(router, { config, database, logger });

  app.use(router);
  app.use("/api/licensing", router);

  return app;
}

module.exports = {
  createLicensingApp,
};
