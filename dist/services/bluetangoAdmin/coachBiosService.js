"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BiosService = void 0;
const models_1 = require("../../models");
const lodash_1 = __importDefault(require("lodash"));
const helperFunction = __importStar(require("../../utils/helperFunction"));
const constants = __importStar(require("../../constants"));
const Sequelize = require('sequelize');
var Op = Sequelize.Op;
const path_1 = __importDefault(require("path"));
const queryService = __importStar(require("../../queryService/bluetangoAdmin/queryService"));
class BiosService {
    constructor() { }
    /*
       * add Bios
       * @param : token
       */
    addBios(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            let qry = { where: {} };
            qry.where = {
                coach_id: params.coach_id,
            };
            qry.raw = true;
            let existingBios = yield queryService.selectOne(models_1.coachBiosModel, qry);
            if (lodash_1.default.isEmpty(existingBios)) {
                params.admin_id = user.uid;
                let bios = yield queryService.addData(models_1.coachBiosModel, params);
                return bios;
            }
            else {
                throw new Error(constants.MESSAGES.bios_already_exist);
            }
        });
    }
    /*
      * update Bios
      * @param : token
      */
    updateBios(params, user) {
        return __awaiter(this, void 0, void 0, function* () {
            let qry = { where: {} };
            qry.where = {
                id: params.id,
            };
            qry.raw = true;
            let existingBios = yield queryService.selectOne(models_1.coachBiosModel, qry);
            if (!lodash_1.default.isEmpty(existingBios)) {
                params.admin_id = user.uid;
                let bios = yield models_1.coachBiosModel.update(params, { returning: true, where: { id: params.id } });
                return bios;
            }
            else {
                throw new Error(constants.MESSAGES.bios_not_exist);
            }
        });
    }
    /*
      * delete Bios
      * @param : token
      */
    deleteBios(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let bios = yield queryService.selectOne(models_1.coachBiosModel, { where: { id: params.id } });
                let fileName = path_1.default.parse(bios.image).base;
                const Param = {
                    Key: fileName
                };
                yield helperFunction.deleteFile(Param);
                let deleteBios = queryService.deleteData(models_1.coachBiosModel, { where: { id: params.id } });
                return deleteBios;
            }
            catch (error) {
                throw new Error(constants.MESSAGES.bad_request);
            }
        });
    }
    /*
          * get all Bios
          * @param : token
          */
    getBios(params) {
        return __awaiter(this, void 0, void 0, function* () {
            let [offset, limit] = yield helperFunction.pagination(params.offset, params.limit);
            let bios = yield queryService.selectAndCountAll(models_1.coachBiosModel, { order: [
                    ['id', 'ASC'],
                ], }, {});
            bios.rows = bios.rows.slice(offset, offset + limit);
            return bios;
        });
    }
    /*
         * get Bio details
         * @param : token
         */
    getBiosDetails(params) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = {
                where: {
                    id: params.id
                }
            };
            let bios = yield queryService.selectOne(models_1.coachBiosModel, query);
            return bios;
        });
    }
}
exports.BiosService = BiosService;
//# sourceMappingURL=coachBiosService.js.map