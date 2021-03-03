"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.employersModel = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = require("../connection");
exports.employersModel = connection_1.sequelize.define("employers", {
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
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    email: {
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
    status: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: '0=>inactive,1=>active,2=>deleted'
    },
    reset_pass_otp: {
        type: sequelize_1.DataTypes.JSONB,
        allowNull: true,
    },
    reset_pass_expiry: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    industry_type: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    address: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    thought_of_the_day: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    }
}, {
    tableName: "employers"
});
exports.employersModel.sync({ alter: true });
//# sourceMappingURL=employers.js.map