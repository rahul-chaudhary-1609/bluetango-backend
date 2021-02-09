"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.departmentModel = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = require("../connection");
exports.departmentModel = connection_1.sequelize.define("department", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    }
}, {
    tableName: "department"
});
exports.departmentModel.sync({ alter: false });
//# sourceMappingURL=department.js.map