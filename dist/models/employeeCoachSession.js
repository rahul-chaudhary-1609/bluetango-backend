"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.employeeCoachSessionsModel = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = require("../connection");
exports.employeeCoachSessionsModel = connection_1.sequelize.define("employee_coach_sessions", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    coach_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    employee_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    employee_rank_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    coach_rating: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    status: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: '0=>inactive,1=>active,2=>deleted'
    }
}, {
    tableName: "employee_coach_sessions"
});
exports.employeeCoachSessionsModel.sync({ alter: true });
//# sourceMappingURL=employeeCoachSession.js.map