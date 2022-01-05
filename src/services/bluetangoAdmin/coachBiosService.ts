import { coachBiosModel } from "../../models";
import _ from "lodash";
import * as helperFunction from "../../utils/helperFunction";
import * as constants from "../../constants";
const Sequelize = require('sequelize');
var Op = Sequelize.Op;
import path from 'path'
import * as queryService from '../../queryService/bluetangoAdmin/queryService';

export class BiosService {
    constructor() { }
    /*
       * add Bios
       * @param : token
       */
    public async addBios(params: any, file: any, user: any) {
        let qry = <any>{ where: {} };
        qry.where = {
            coach_id: params.coach_id,
        };
        qry.raw = true;
        let existingBios = await queryService.selectOne(coachBiosModel, qry)
        if (_.isEmpty(existingBios)) {
            if (file) {
                let profilePic = await helperFunction.uploadFile(file, "bios_profile_pic");
                params.image = profilePic;
            }
            params.admin_id = user.uid;
            let bios = await queryService.addData(coachBiosModel, params)
            return bios;
        } else {
            throw new Error(constants.MESSAGES.bios_already_exist);
        }
    }
    /*
      * update Bios
      * @param : token
      */
    public async updateBios(params: any, file: any, user: any) {
        let qry = <any>{ where: {} };
        qry.where = {
            id: params.id,
        };
        qry.raw = true;
        let existingBios = await queryService.selectOne(coachBiosModel, qry)
        if (!_.isEmpty(existingBios)) {
            if (file) {
                let profilePic = await helperFunction.uploadFile(file, "bios_profile_pic");
                params.image = profilePic;
                let fileName = path.parse(existingBios.image).base;
                const Params = {
                    Key: "bios_profile_pic/" + fileName
                };
                await helperFunction.deleteFile(Params)
            }
            params.admin_id = user.uid;
            let bios = await coachBiosModel.update(
                params,
                { returning: true, where: { id: params.id } }
            )
            return bios;
        } else {
            throw new Error(constants.MESSAGES.bios_not_exist);
        }
    }
    /*
      * delete Bios
      * @param : token
      */
    public async deleteBios(params: any) {
        try {
            let bios = await queryService.selectOne(coachBiosModel, { where: { id: params.id } })
            let fileName = path.parse(bios.image).base;
            const Param = {
                Key: fileName
            };
            await helperFunction.deleteFile(Param)
            let deleteBios = queryService.deleteData(coachBiosModel, { where: { id: params.id } })
            return deleteBios;
        } catch (error) {
            throw new Error(constants.MESSAGES.bad_request);
        }
    }
    /*
          * get all Bios
          * @param : token
          */
    public async getBios(params: any) {
        let [offset, limit] = await helperFunction.pagination(params.offset, params.limit)
        let bios = await queryService.selectAndCountAll(coachBiosModel, {}, {})
        return bios.rows = bios.rows.slice(offset, offset + limit);


    }
}