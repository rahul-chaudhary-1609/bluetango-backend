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
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomepageServices = void 0;
const helperFunction = __importStar(require("../../utils/helperFunction"));
const constants = __importStar(require("../../constants"));
const coachManagement_1 = require("../../models/coachManagement");
const advisorManagement_1 = require("../../models/advisorManagement");
const articleManagement_1 = require("../../models/articleManagement");
const subscriptionManagement_1 = require("../../models/subscriptionManagement");
const queryService = __importStar(require("../../queryService/bluetangoAdmin/queryService"));
const index_1 = require("../../models/index");
const Sequelize = require('sequelize');
class HomepageServices {
    constructor() { }
    /*
* function to get all coaches
*/
    getCoaches() {
        return __awaiter(this, void 0, void 0, function* () {
            let coachList = yield coachManagement_1.coachManagementModel.findAndCountAll({
                attributes: ['id', 'name', 'image', 'fileName', 'description'],
                where: {
                    status: constants.STATUS.active,
                },
                order: [["createdAt", "DESC"]]
            });
            return yield helperFunction.convertPromiseToObject(coachList);
        });
    }
    /*
* function to get all advisors
*/
    getAdvisors() {
        return __awaiter(this, void 0, void 0, function* () {
            let advisorList = yield advisorManagement_1.advisorManagementModel.findAndCountAll({
                attributes: ['id', 'title', 'image', 'description'],
                where: {
                    status: constants.STATUS.active,
                },
                order: [["createdAt", "DESC"]]
            });
            return yield helperFunction.convertPromiseToObject(advisorList);
        });
    }
    /*
* function to get all articles
*/
    getArticles() {
        return __awaiter(this, void 0, void 0, function* () {
            let articleList = yield articleManagement_1.articleManagementModel.findAndCountAll({
                attributes: ['id', 'title', 'image', 'description'],
                where: {
                    status: constants.STATUS.active,
                },
                order: [["createdAt", "DESC"]]
            });
            return yield helperFunction.convertPromiseToObject(articleList);
        });
    }
    /*
 * function to get all subscription plans
 */
    getSubscriptions() {
        return __awaiter(this, void 0, void 0, function* () {
            let subscriptionList = yield subscriptionManagement_1.subscriptionManagementModel.findAndCountAll({
                attributes: ['id', 'plan_name', 'description', 'charge', 'duration'],
                where: {
                    status: constants.STATUS.active,
                },
                order: ["charge"]
            });
            return yield helperFunction.convertPromiseToObject(subscriptionList);
        });
    }
    /*
      *get static content
      */
    getStaticContent(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield queryService.selectOne(index_1.staticContentModel, {
                where: { id: 1 },
                attributes: [`${params.contentType}`]
            });
        });
    }
    /*
                 * get all Bios
                 * @param : token
                 */
    getBios(params) {
        return __awaiter(this, void 0, void 0, function* () {
            index_1.coachBiosModel.belongsTo(coachManagement_1.coachManagementModel, { foreignKey: "coach_id" });
            let query = {
                include: [
                    {
                        model: coachManagement_1.coachManagementModel,
                        attributes: ['name'],
                        required: true,
                    }
                ],
            };
            let [offset, limit] = yield helperFunction.pagination(params.offset, params.limit);
            let bios = yield queryService.selectAndCountAll(index_1.coachBiosModel, query, {});
            bios.rows = bios.rows.slice(offset, offset + limit);
            return bios;
        });
    }
}
exports.HomepageServices = HomepageServices;
//# sourceMappingURL=homepageServices.js.map