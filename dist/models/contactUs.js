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
    },
    type: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: "1=> employee, 2=> employer, 3=>coach"
    },
}, {
    tableName: "contact_us"
});
exports.contactUsModel.sync({ alter: false });
//# sourceMappingURL=contactUs.js.map