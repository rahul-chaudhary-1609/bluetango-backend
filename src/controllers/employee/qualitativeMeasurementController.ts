import { QualitativeMeasuremetServices } from "../../services/employee/qualitativeMeasurementServices";
import * as constants from '../../constants';
import * as appUtils from '../../utils/appUtils';


//Instantiates a Home services  
const qualitativeMeasuremetServices = new QualitativeMeasuremetServices();

export class QualitativeMeasurementController {

    constructor() { }

    /**
    * add qualitative measurement
    * @param req :[]
    * @param res 
    */
    public async addQualitativeMeasurement(req: any, res: any, next: any) {
        try {
            const responseFromService = await qualitativeMeasuremetServices.addQualitativeMeasurement(req.body, req.user);
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
        } catch (e) {
            next(e)
        }
    }

    /**
    * add Attribute Ratings
    * @param req :[]
    * @param res 
    */
     public async addAttributeRatings(req: any, res: any, next: any) {
        try {
            const responseFromService = await qualitativeMeasuremetServices.addAttributeRatings(req.body, req.user);
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
        } catch (e) {
            next(e)
        }
    }
    
     /**
    * get qualitative measurement
    * @param req :[]
    * @param res 
    */
    public async getQualitativeMeasurement(req: any, res: any, next: any) {
        try {
            const responseFromService = await qualitativeMeasuremetServices.getQualitativeMeasurement(req.query,req.user);
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
        } catch (e) {
            next(e)
        }
    }

     /**
    * get qualitative measurement
    * @param req :[]
    * @param res 
    */
      public async getAttributeRatings(req: any, res: any, next: any) {
        try {
            const responseFromService = await qualitativeMeasuremetServices.getAttributeRatings(req.query,req.user);
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
        } catch (e) {
            next(e)
        }
    }

    /**
   * get qualitative measurement details
   * @param req :[]
   * @param res 
   */
    public async getQualitativeMeasurementDetails(req: any, res: any, next: any) {
        try {
            const responseFromService = await qualitativeMeasuremetServices.getQualitativeMeasurementDetails(req.query, req.user);
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
        } catch (e) {
            next(e)
        }
    }

    /**
   * get Attributes
   * @param req :[]
   * @param res 
   */
     public async getAttributeList(req: any, res: any, next: any) {
        try {
            const responseFromService = await qualitativeMeasuremetServices.getAttributeList(req.params, req.user);
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
        } catch (e) {
            next(e)
        }
    }

    /**
    * get qualitative measurement comment list
    * @param req :[]
    * @param res 
    */
    public async getQuantitativeMeasurementCommentList(req: any, res: any, next: any) {
        try {
            const responseFromService = await qualitativeMeasuremetServices.getQuantitativeMeasurementCommentList();
            appUtils.successResponse(res, responseFromService, constants.MESSAGES.success);
        } catch (e) {
            next(e)
        }
    }

}