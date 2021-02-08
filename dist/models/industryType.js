"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.industryTypeModel = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = require("../connection");
exports.industryTypeModel = connection_1.sequelize.define("industry_type", {
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
    tableName: "industry_type"
});
exports.industryTypeModel.sync({ alter: true });
//# sourceMappingURL=industryType.js.map