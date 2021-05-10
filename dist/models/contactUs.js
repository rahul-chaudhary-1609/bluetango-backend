"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactUsModel = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = require("../connection");
exports.contactUsModel = connection_1.sequelize.define("contact_us", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    employer_id: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    employee_id: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    message: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false
    },
    status: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: '0=>inactive,1=>active,2=>deleted'
    }
}, {
    tableName: "contact_us"
});
exports.contactUsModel.sync({ alter: true });
//# sourceMappingURL=contactUs.js.map