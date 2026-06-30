function createActivationRepository(database) {
  return {
    async countActiveActivations(licenseId) {
      const { rows } = await database.query(
        `select count(*)::int as count
           from activations
          where license_id = $1
            and status = 'active'`,
        [licenseId]
      );

      return rows[0]?.count ?? 0;
    },

    async findActivation(licenseId, machineId) {
      const { rows } = await database.query(
        `select *
           from activations
          where license_id = $1
            and machine_id = $2
          limit 1`,
        [licenseId, machineId]
      );

      return rows[0] ?? null;
    },

    async upsertActivation({
      licenseId,
      machineId,
      machineLabel,
      appVersion,
      leaseExpiresAt,
      metadata,
    }) {
      const { rows } = await database.query(
        `insert into activations
          (license_id, machine_id, machine_label, app_version, lease_expires_at, metadata)
         values ($1, $2, $3, $4, $5, $6::jsonb)
         on conflict (license_id, machine_id)
         do update set
           machine_label = excluded.machine_label,
           app_version = excluded.app_version,
           lease_expires_at = excluded.lease_expires_at,
           metadata = excluded.metadata,
           status = 'active',
           revoked_at = null,
           last_seen_at = now(),
           updated_at = now()
         returning *`,
        [
          licenseId,
          machineId,
          machineLabel || "",
          appVersion || "",
          leaseExpiresAt,
          JSON.stringify(metadata || {}),
        ]
      );

      return rows[0];
    },

    async releaseActivation(licenseId, machineId) {
      const { rows } = await database.query(
        `update activations
            set status = 'released',
                revoked_at = now(),
                updated_at = now()
          where license_id = $1
            and machine_id = $2
          returning *`,
        [licenseId, machineId]
      );

      return rows[0] ?? null;
    },
  };
}

module.exports = {
  createActivationRepository,
};
