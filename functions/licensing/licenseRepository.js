const crypto = require("node:crypto");

function makeLicenseCode() {
  const raw = crypto.randomBytes(8).toString("hex").toUpperCase();
  return `DDC-${raw.slice(0, 4)}-${raw.slice(4, 8)}-${raw.slice(8, 12)}-${raw.slice(12, 16)}`;
}

function createLicenseRepository(database) {
  return {
    async issueLicense({
      productId,
      customerEmail,
      customerName,
      expiresAt,
      maxActivations,
      leaseDurationDays,
      boundMachineId,
      features,
      notes,
      metadata,
      licenseCode,
    }) {
      const finalLicenseCode = licenseCode?.trim() || makeLicenseCode();

      const { rows } = await database.query(
        `insert into licenses
          (license_code, product_id, customer_email, customer_name, expires_at,
           max_activations, lease_duration_days, bound_machine_id, features, notes, metadata)
         values ($1, $2, $3, $4, $5, $6, $7, $8, $9::jsonb, $10, $11::jsonb)
         returning *`,
        [
          finalLicenseCode,
          productId,
          customerEmail,
          customerName,
          expiresAt,
          maxActivations,
          leaseDurationDays,
          boundMachineId || null,
          JSON.stringify(features || []),
          notes || "",
          JSON.stringify(metadata || {}),
        ]
      );

      return rows[0];
    },

    async findLicenseByCode(licenseCode) {
      const { rows } = await database.query(
        "select * from licenses where license_code = $1 limit 1",
        [licenseCode]
      );
      return rows[0] ?? null;
    },

    async revokeLicense(licenseCode, reason) {
      const revokedAt = new Date();

      await database.query(
        `update licenses
            set status = 'revoked',
                revoked_at = $2,
                updated_at = now(),
                metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object('revokeReason', $3)
          where license_code = $1`,
        [licenseCode, revokedAt, reason || null]
      );

      await database.query(
        `update activations
            set status = 'revoked',
                revoked_at = $2,
                updated_at = now()
          where license_id = (select id from licenses where license_code = $1)`,
        [licenseCode, revokedAt]
      );

      return this.findLicenseByCode(licenseCode);
    },

    async listActivationsForLicense(licenseId) {
      const { rows } = await database.query(
        "select * from activations where license_id = $1 order by first_seen_at asc",
        [licenseId]
      );
      return rows;
    },
  };
}

module.exports = {
  createLicenseRepository,
};
