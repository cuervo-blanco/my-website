const { Pool } = require("pg");

function createDatabase(databaseUrl) {
  if (!databaseUrl) {
    return {
      configured: false,
      pool: null,
      async query() {
        throw new Error("LICENSING_DATABASE_URL is not configured.");
      },
      async close() {},
    };
  }

  const pool = new Pool({
    connectionString: databaseUrl,
    max: 5,
  });

  return {
    configured: true,
    pool,
    async query(text, params = []) {
      return pool.query(text, params);
    },
    async close() {
      await pool.end();
    },
  };
}

module.exports = {
  createDatabase,
};
