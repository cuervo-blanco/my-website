function requireAdmin(config) {
  return (request, response, next) => {
    const authorizationHeader = request.get("authorization") || "";
    const bearerToken = authorizationHeader.startsWith("Bearer ")
      ? authorizationHeader.slice("Bearer ".length).trim()
      : "";
    const headerToken = `${request.get("x-admin-token") || ""}`.trim();
    const token = bearerToken || headerToken;

    if (!config.adminToken) {
      response.status(503).json({
        ok: false,
        error: "admin_unavailable",
        message: "The admin token is not configured.",
      });
      return;
    }

    if (token !== config.adminToken) {
      response.status(401).json({
        ok: false,
        error: "unauthorized",
        message: "A valid admin token is required.",
      });
      return;
    }

    next();
  };
}

module.exports = {
  requireAdmin,
};
