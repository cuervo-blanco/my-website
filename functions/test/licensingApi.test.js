const assert = require("node:assert/strict");
const http = require("node:http");
const test = require("node:test");

const { createLicensingApp } = require("../licensing/app");
const {
  issueSignedLicense,
  verifySignedLicense,
} = require("../licensing/signedLicense");

const publicKey =
  "3,968286ca2e8d213f8cf1bf6ec495931f5d8fa93925a07d5119e84b478a01ebf2e8cea5836b6144ca55455f323beaf6048aa5b450416cfd0443c269bfe95d002605c1076050f9d9f43c49e2ee5f89a1cf58f6c952635904a503a21e3a1f8493a7d3d48361aa5ffe126bc237db646e23cf0c92656f42779299b6c5c6fabd819d25fb3ab5613716616f02e7cbac9d5f18bcffa22cf88b10f8655b3554cf41793dc47ca375d878505a206e0677582a321770f8ff6ef65b6f63191f9762fb257b9b101ca8288d1df85feff491bd1bcc5f51cb99f98e517257b98ca11a9c0339f44ead342472b72d5d8c4062a7207e263509012c5e1147425aceb224c37e19d3449a17";
const privateKey =
  "64570486c9b36b7fb34bd4f4830e6214e90a70d0c3c0538b669adcda5c0147f745df190247962ddc38d8ea217d474eadb1c3cd8ad648a8ad82819bd5463e0019592b5a4035fbe6a2d2dbec9eea5bc134e5f9db8c423b586e026c1426bfadb7c537e302411c3ffeb6f2817a9242f417df5db6ee4a2c4fb7112483d9fc7e5668c2f6c2e70c2d149e79472ce8ad635014e3dfd60b3227de8c64529b740b962bf3b88140ffa5ae9ef28f685bced1134d32eac6492a7b337dfa91015249391cd92b2cf2c328fda112aa1dab24ad7da615747a1696042039e5478794b29660f47035124218590c472e478462c04f609e0e63e04592a7c67a95cdc68295b8740198cb1b,968286ca2e8d213f8cf1bf6ec495931f5d8fa93925a07d5119e84b478a01ebf2e8cea5836b6144ca55455f323beaf6048aa5b450416cfd0443c269bfe95d002605c1076050f9d9f43c49e2ee5f89a1cf58f6c952635904a503a21e3a1f8493a7d3d48361aa5ffe126bc237db646e23cf0c92656f42779299b6c5c6fabd819d25fb3ab5613716616f02e7cbac9d5f18bcffa22cf88b10f8655b3554cf41793dc47ca375d878505a206e0677582a321770f8ff6ef65b6f63191f9762fb257b9b101ca8288d1df85feff491bd1bcc5f51cb99f98e517257b98ca11a9c0339f44ead342472b72d5d8c4062a7207e263509012c5e1147425aceb224c37e19d3449a17";

function createInMemoryDatabase() {
  const state = {
    license: {
      id: "license-1",
      license_code: "DDC-TEST-0001",
      product_id: "didi-compensate",
      customer_email: "editor@example.com",
      customer_name: "Sample Editor",
      status: "active",
      max_activations: 1,
      lease_duration_days: 7,
      bound_machine_id: null,
      expires_at: null,
      features: ["beta"],
    },
    activations: new Map(),
  };

  return {
    configured: true,
    async query(text, params = []) {
      const sql = text.replace(/\s+/g, " ").trim().toLowerCase();

      if (sql.startsWith("select * from licenses where license_code =")) {
        return {
          rows:
            state.license.license_code === params[0] ? [state.license] : [],
        };
      }

      if (sql.includes("from activations where license_id = $1 and machine_id = $2")) {
        const activation = state.activations.get(params[1]);
        return { rows: activation ? [activation] : [] };
      }

      if (sql.includes("select count(*)::int as count from activations")) {
        let count = 0;

        for (const activation of state.activations.values()) {
          if (
            activation.license_id === params[0] &&
            activation.status === "active"
          ) {
            count += 1;
          }
        }

        return { rows: [{ count }] };
      }

      if (sql.startsWith("insert into activations")) {
        const activation = {
          id: `activation-${params[1]}`,
          license_id: params[0],
          machine_id: params[1],
          machine_label: params[2],
          app_version: params[3],
          lease_expires_at: params[4],
          metadata: JSON.parse(params[5]),
          status: "active",
        };

        state.activations.set(params[1], activation);
        return { rows: [activation] };
      }

      if (sql.startsWith("update activations set status = 'released'")) {
        const activation = state.activations.get(params[1]);
        if (!activation || activation.license_id !== params[0]) {
          return { rows: [] };
        }

        const released = { ...activation, status: "released" };
        state.activations.set(params[1], released);
        return { rows: [released] };
      }

      throw new Error(`Unhandled query in test database: ${text}`);
    },
  };
}

async function withServer(runTest) {
  const app = createLicensingApp({
    config: {
      adminToken: "test-token",
      productId: "didi-compensate",
      privateKey,
      publicKey,
      defaultLeaseDurationDays: 7,
    },
    database: createInMemoryDatabase(),
  });

  const server = http.createServer(app);

  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));

  const address = server.address();
  const baseUrl = `http://127.0.0.1:${address.port}`;

  try {
    await runTest(baseUrl);
  } finally {
    await new Promise((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve()))
    );
  }
}

test("signed licenses verify with the public key", () => {
  const envelope = issueSignedLicense(
    {
      productId: "didi-compensate",
      licenseId: "DDC-TEST-0001",
      licenseeEmail: "editor@example.com",
      licenseeName: "Sample Editor",
      machineId: "macos:test-machine",
      features: ["beta"],
      issuedAtMs: Date.now(),
      expiresAtMs: Date.now() + 3600000,
    },
    privateKey
  );

  const verification = verifySignedLicense(envelope, publicKey);

  assert.equal(verification.ok, true);
  assert.equal(verification.envelope.payload.licenseId, "DDC-TEST-0001");
  assert.equal(verification.envelope.payload.machineId, "macos:test-machine");
});

test("refresh and release require a signed lease envelope", async () => {
  await withServer(async (baseUrl) => {
    const invalidRefreshResponse = await fetch(
      `${baseUrl}/v1/activations/refresh`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ machineLabel: "MacBook Pro" }),
      }
    );
    const invalidRefreshJson = await invalidRefreshResponse.json();

    assert.equal(invalidRefreshResponse.status, 400);
    assert.equal(invalidRefreshJson.error, "validation_error");

    const activationResponse = await fetch(
      `${baseUrl}/v1/activations/request`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          licenseCode: "DDC-TEST-0001",
          machineId: "macos:test-machine",
          machineLabel: "MacBook Pro",
          productId: "didi-compensate",
          appVersion: "0.6.0",
        }),
      }
    );
    const activationJson = await activationResponse.json();

    assert.equal(activationResponse.status, 200);
    assert.equal(activationJson.ok, true);

    const refreshResponse = await fetch(
      `${baseUrl}/v1/activations/refresh`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          signedLicense: activationJson.signedLicense,
          machineLabel: "MacBook Pro",
          appVersion: "0.6.1",
        }),
      }
    );
    const refreshJson = await refreshResponse.json();

    assert.equal(refreshResponse.status, 200);
    assert.equal(refreshJson.ok, true);
    assert.equal(refreshJson.activation.machineId, "macos:test-machine");

    const releaseResponse = await fetch(
      `${baseUrl}/v1/activations/release`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          signedLicense: refreshJson.signedLicense,
        }),
      }
    );
    const releaseJson = await releaseResponse.json();

    assert.equal(releaseResponse.status, 200);
    assert.equal(releaseJson.ok, true);
    assert.equal(releaseJson.activation.status, "released");
  });
});

test("same-domain hosting prefix reaches the same health route", async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/licensing/health`);
    const json = await response.json();

    assert.equal(response.status, 200);
    assert.equal(json.ok, true);
    assert.equal(json.service, "didi-compensate-licensing");
  });
});
