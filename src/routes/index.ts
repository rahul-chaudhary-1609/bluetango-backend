const ROUTE_PREFIX = `/api/v1/`;
import adminRoute  from "./adminRoute";

module.exports = function(app) {
  app.use(`${ROUTE_PREFIX}admin`, adminRoute);
}
