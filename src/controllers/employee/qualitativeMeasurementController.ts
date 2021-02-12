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
    
}