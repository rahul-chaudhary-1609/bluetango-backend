"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminModel = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = require("../connection");
exports.adminModel = connection_1.sequelize.define("admins", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    admin_role: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 2,
        comment: '1=>super_admin/2=>sub_admin'
    },
    reset_pass_otp: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    country_code: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    phone_number: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    thought_of_the_day: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    reset_pass_expiry: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
    status: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: '0=>inactive,1=>active,2=>deleted'
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    token: {
        type: sequelize_1.DataTypes.STRING(600),
        allowNull: true,
    }
}, {
    tableName: "admins"
});
exports.adminModel.sync({ alter: false });
//# sourceMappingURL=admin.js.map