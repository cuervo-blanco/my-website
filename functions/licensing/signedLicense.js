const crypto = require("node:crypto");

const { applyJuceRsaKeyToBuffer } = require("./juceRsa");

const signedLicenseSchema = "didi_compensate/signed_license@1";
const signedLicenseDigestPrefix = "didi_compensate_license_v1:";

function sortedFeatures(features) {
  return [...new Set((features || []).map((feature) => `${feature}`.trim()).filter(Boolean))].sort();
}

function canonicalPayload(payload) {
  return {
    schemaVersion: 1,
    productId: payload.productId,
    licenseId: payload.licenseId,
    licenseeEmail: payload.licenseeEmail,
    licenseeName: payload.licenseeName,
    machineId: payload.machineId || "",
    issuedAtMs: payload.issuedAtMs,
    expiresAtMs: payload.expiresAtMs || 0,
    features: sortedFeatures(payload.features),
  };
}

function createSignedLicenseDigest(payload) {
  const canonical = canonicalPayload(payload);
  const canonicalString = JSON.stringify(canonical);
  const digestHex = crypto
    .createHash("sha256")
    .update(canonicalString, "utf8")
    .digest("hex");

  return {
    canonical,
    canonicalString,
    digestToken: `${signedLicenseDigestPrefix}${digestHex}`,
  };
}

function issueSignedLicense(payload, privateKeyText) {
  const { canonical, digestToken } = createSignedLicenseDigest(payload);
  const signatureBuffer = applyJuceRsaKeyToBuffer(
    Buffer.from(digestToken, "utf8"),
    privateKeyText
  );

  return {
    schema: signedLicenseSchema,
    payload: canonical,
    signature: signatureBuffer.toString("hex"),
  };
}

function verifySignedLicense(envelope, publicKeyText) {
  if (!envelope || typeof envelope !== "object") {
    return { ok: false, message: "Signed license payload is missing." };
  }

  if (envelope.schema !== signedLicenseSchema) {
    return {
      ok: false,
      message: "Signed license schema is not supported.",
    };
  }

  if (!envelope.signature || typeof envelope.signature !== "string") {
    return { ok: false, message: "Signed license signature is missing." };
  }

  const { canonical, digestToken } = createSignedLicenseDigest(
    envelope.payload || {}
  );
  const recoveredDigest = applyJuceRsaKeyToBuffer(
    Buffer.from(envelope.signature, "hex"),
    publicKeyText
  ).toString("utf8");

  if (recoveredDigest !== digestToken) {
    return {
      ok: false,
      message: "Signed license signature check failed.",
    };
  }

  return {
    ok: true,
    envelope: {
      schema: signedLicenseSchema,
      payload: canonical,
      signature: envelope.signature,
    },
  };
}

module.exports = {
  createSignedLicenseDigest,
  issueSignedLicense,
  verifySignedLicense,
};
