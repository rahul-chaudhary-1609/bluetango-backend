"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.coachManagementModel = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = require("../connection");
exports.coachManagementModel = connection_1.sequelize.define("coach_management", {
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
    password: {
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
    description: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    device_token: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    first_time_login: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: '0=>not first time,1=>first time'
    },
    first_time_login_datetime: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: "2021-04-13",
    },
    first_time_reset_password: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: '0=>not first time,1=>first time'
    },
    status: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: '0=>inactive,1=>active,2=>deleted'
    },
    image: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true
    },
    fileName: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true
    },
    coach_specialization_category_ids: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.INTEGER),
    },
    employee_rank_ids: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.INTEGER),
    },
    coach_charge: {
        type: sequelize_1.DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
    }
}, {
    tableName: "coach_management"
});
exports.coachManagementModel.sync({ alter: false });
//# sourceMappingURL=coachManagement.js.map