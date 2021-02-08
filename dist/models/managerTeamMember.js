"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.managerTeamMemberModel = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = require("../connection");
exports.managerTeamMemberModel = connection_1.sequelize.define("manager_team_member", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    manager_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    team_member_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    tableName: "manager_team_member"
});
exports.managerTeamMemberModel.sync({ alter: true });
//# sourceMappingURL=managerTeamMember.js.map