import { adminModel } from './admin';
import { employersModel } from './employers';
import { employeeModel } from './employee';
import { departmentModel } from './department';
import { industryTypeModel } from './industryType';
import { emojiModel } from './emoji';
import { coachManagementModel } from './coachManagement';
import { coachBiosModel } from './coachBios';
import { staticContentModel } from './staticContent';
import {employeeCoachSessionsModel} from './employeeCoachSession';
import {employeeRanksModel} from './employeeRanks';
import {coachSpecializationCategoriesModel} from './coachSpecializationCategories'
import {coachScheduleModel} from './coachSchedule'
import {bluetangoAdminRolesModel}from './bluetangoAdminRoles'
import {bluetangoAdminModel} from './bluetangoAdmin'
import {thoughtsModel} from './thoughts'
/* all associations put here to avoid duplicate association */
employeeModel.hasOne(emojiModel,{ as: 'energy_emoji_data', foreignKey: "id", sourceKey: "energy_id", targetKey: "id" });
employeeModel.hasOne(emojiModel,{ as: 'job_emoji_data', foreignKey: "id", sourceKey: "job_emoji_id", targetKey: "id" });

export {
    adminModel,
    employersModel,
    employeeModel,
    departmentModel,
    industryTypeModel,
    coachManagementModel,
    coachBiosModel,
    staticContentModel,
    employeeCoachSessionsModel,
    employeeRanksModel,
    coachSpecializationCategoriesModel,
    coachScheduleModel,
    bluetangoAdminRolesModel,
    bluetangoAdminModel,
    thoughtsModel
}