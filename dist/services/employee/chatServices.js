"use strict";
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
exports.ChatServices = void 0;
const teamGoal_1 = require("../../models/teamGoal");
const teamGoalAssign_1 = require("../../models/teamGoalAssign");
const qualitativeMeasurementComment_1 = require("../../models/qualitativeMeasurementComment");
const Sequelize = require('sequelize');
var Op = Sequelize.Op;
class ChatServices {
    constructor() { }
    /*
    * function to getchat popup list as employee
    */
    getChatPopListAsEmployee(user) {
        return __awaiter(this, void 0, void 0, function* () {
            teamGoalAssign_1.teamGoalAssignModel.hasOne(teamGoal_1.teamGoalModel, { foreignKey: "id", sourceKey: "goal_id", targetKey: "id" });
            let employeeGoalData = yield teamGoalAssign_1.teamGoalAssignModel.findAll({
                where: {
                    employee_id: user.uid
                },
                attributes: ['id'],
                include: [
                    {
                        model: teamGoal_1.teamGoalModel,
                        required: false,
                        attributes: ['title']
                    }
                ]
            });
            let getQuantitativeData = yield qualitativeMeasurementComment_1.qualitativeMeasurementCommentModel.findAll();
            return employeeGoalData.concat(getQuantitativeData);
        });
    }
}
exports.ChatServices = ChatServices;
//# sourceMappingURL=chatServices.js.map