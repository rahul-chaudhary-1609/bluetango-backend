"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.employeeModel = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = require("../connection");
exports.employeeModel = connection_1.sequelize.define("employee", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    current_employer_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    current_department_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    current_designation: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    current_date_of_joining: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true
    },
    prev_employer: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    prev_department: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    prev_designation: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    prev_date_of_joining: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
    prev_exit: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    date_of_birth: {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: true,
    },
    employee_code: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    profile_pic_url: {
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
    first_time_login: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: '0=>not first time,1=>first time'
    },
    first_time_reset_password: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: '0=>not first time,1=>first time'
    },
    is_manager: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
        comment: '0=>notManager,1=>manager'
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    accomplishments: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    device_token: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    thought_of_the_day: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    energy_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
}, {
    tableName: "employee"
});
exports.employeeModel.sync({ alter: false });
//# sourceMappingURL=employee.js.map