import _ from "lodash";
import * as helperFunction from "../../utils/helperFunction";
import * as constants from "../../constants";
import { coachManagementModel } from "../../models/coachManagement";
import { advisorManagementModel } from "../../models/advisorManagement";
import { articleManagementModel } from "../../models/articleManagement";
import { subscriptionManagementModel } from "../../models/subscriptionManagement";
import * as queryService from '../../queryService/bluetangoAdmin/queryService';
import { staticContentModel, coachBiosModel } from "../../models/index"

const Sequelize = require('sequelize');


export class HomepageServices {
    constructor() { }

    /*
* function to get all coaches
*/
    public async getCoaches() {

        let coachList = await coachManagementModel.findAndCountAll({
            attributes: ['id', 'name', 'image', 'fileName', 'description'],
            where: {
                status: constants.STATUS.active,
            },
            order:[["createdAt","DESC"]]
        });

        return await helperFunction.convertPromiseToObject(coachList);
    }

    /*
* function to get all advisors
*/
    public async getAdvisors() {

        let advisorList = await advisorManagementModel.findAndCountAll({
            attributes: ['id', 'title', 'image', 'description'],
            where: {
                status: constants.STATUS.active,
            },
            order: [["createdAt", "DESC"]]
        });

        return await helperFunction.convertPromiseToObject(advisorList);
    }


    /*
* function to get all articles
*/
    public async getArticles() {

        let articleList = await articleManagementModel.findAndCountAll({
            attributes: ['id', 'title', 'image', 'description'],
            where: {
                status: constants.STATUS.active,
            },
            order: [["createdAt", "DESC"]]
        });

        return await helperFunction.convertPromiseToObject(articleList);
    }

    /*
 * function to get all subscription plans
 */
    public async getSubscriptions() {

        let subscriptionList = await subscriptionManagementModel.findAndCountAll({
            attributes: ['id', 'plan_name', 'description', 'charge', 'duration'],
            where: {
                status: constants.STATUS.active,
            },
            order: ["charge"]
        });

        return await helperFunction.convertPromiseToObject(subscriptionList);
    }
    /*
      *get static content
      */
      public async getStaticContent(params: any) {
        return await queryService.selectOne(staticContentModel, {
            where: { id: 1 },
            attributes: [`${params.contentType}`]
        })
    }
 /*
              * get all Bios
              * @param : token
              */
 public async getBios(params: any) {
    let [offset, limit] = await helperFunction.pagination(params.offset, params.limit)
    let bios = await queryService.selectAndCountAll(coachBiosModel, {}, {})
    bios.rows = bios.rows.slice(offset, offset + limit);
    return bios


}
}