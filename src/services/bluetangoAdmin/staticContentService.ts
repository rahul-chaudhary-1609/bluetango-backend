import { staticContentModel } from "../../models";
import _ from "lodash";
import * as helperFunction from "../../utils/helperFunction";
import * as constants from "../../constants";
const Sequelize = require('sequelize');
var Op = Sequelize.Op;
import path from 'path'
import * as queryService from '../../queryService/bluetangoAdmin/queryService';

export class StaticContentService {
    constructor() { }
    /*
     * update static content
     * @param : token
     */
    public async addStaticContent(params: any, user: any) {
        params.model = staticContentModel
        let staticData = await queryService.updateData(params, { returning: true, where: { id: 1 } })
        return staticData;
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
}