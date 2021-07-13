"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscriptionManagementModel = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = require("../connection");
exports.subscriptionManagementModel = connection_1.sequelize.define("subscription_management", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    plan_name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    description: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
        allowNull: true,
    },
    charge: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    duration: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    status: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: '0=>inactive,1=>active,2=>deleted'
    },
}, {
    tableName: "subscription_management"
});
exports.subscriptionManagementModel.sync({ alter: false });
//# sourceMappingURL=subscriptionManagement.js.map