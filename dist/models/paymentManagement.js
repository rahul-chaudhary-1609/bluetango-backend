"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentManagementModel = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = require("../connection");
exports.paymentManagementModel = connection_1.sequelize.define("payment_management", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    admin_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    employer_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    plan_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    purchase_date: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    expiry_date: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    amount: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    transaction_id: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    status: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: '0=>inactive,1=>active,2=>deleted'
    },
}, {
    tableName: "payment_management"
});
exports.paymentManagementModel.sync({ alter: false });
//# sourceMappingURL=paymentManagement.js.map