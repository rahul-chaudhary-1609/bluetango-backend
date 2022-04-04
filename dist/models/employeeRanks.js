"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.employeeRanksModel = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = require("../connection");
exports.employeeRanksModel = connection_1.sequelize.define("employee_ranks", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
    },
    status: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: '0=>inactive,1=>active,2=>deleted'
    }
}, {
    tableName: "employee_ranks"
});
exports.employeeRanksModel.sync({ alter: true });
//# sourceMappingURL=employeeRanks.js.map