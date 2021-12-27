const ROUTE_PREFIX = `/api/v1/`;
import adminRoute  from "./adminRoute";
import employeeRoute  from "./employeeRoute";
import employerRoute from "./employerRoute";
import coachRoute from "./coachRoute";
import webRoute from "./webRoute";
import bluetangoAdminRoute from "./bluetangoAdminRoute";
import * as appUtils from '../utils/appUtils';
import * as constants from '../constants';
//import buleangoRoute from './bluetangoRoute'
module.exports = function(app) {
  app.use(`${ROUTE_PREFIX}admin`, adminRoute);
  app.use(`${ROUTE_PREFIX}employee`, employeeRoute);
  app.use(`${ROUTE_PREFIX}employer`, employerRoute);
  app.use(`${ROUTE_PREFIX}coach`, coachRoute);
  app.use(`${ROUTE_PREFIX}web`, webRoute);
  app.use(`${ROUTE_PREFIX}bluetango-admin`, bluetangoAdminRoute);
  app.use((err, req, res, next) => {
    appUtils.errorResponse(res, err, constants.code.error_code);
  });
}
