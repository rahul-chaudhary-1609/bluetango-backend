const ROUTE_PREFIX = `/api/v1/`;
import adminRoute  from "./adminRoute";
import employeeRoute  from "./employeeRoute";
import * as appUtils from '../utils/appUtils';
import * as constants from '../constants';

module.exports = function(app) {
  app.use(`${ROUTE_PREFIX}admin`, adminRoute);
  app.use(`${ROUTE_PREFIX}employee`, employeeRoute);
  app.use((err, req, res, next) => {
    appUtils.errorResponse(res, err, constants.code.error_code);
  });
}
