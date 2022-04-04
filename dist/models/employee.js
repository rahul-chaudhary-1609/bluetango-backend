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
    },
    current_date_of_joining: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true
    },
    prev_employers: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.JSON),
    },
    prev_employer: {
        type: sequelize_1.DataTypes.STRING,
    },
    prev_department: {
        type: sequelize_1.DataTypes.STRING,
    },
    prev_designation: {
        type: sequelize_1.DataTypes.STRING,
    },
    prev_date_of_joining: {
        type: sequelize_1.DataTypes.DATE,
    },
    prev_exit: {
        type: sequelize_1.DataTypes.DATE,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    date_of_birth: {
        type: sequelize_1.DataTypes.DATEONLY,
    },
    // employee_code: {
    //     type: DataTypes.STRING,
    //     allowNull: false,
    // },
    profile_pic_url: {
        type: sequelize_1.DataTypes.STRING,
    },
    country_code: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    phone_number: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
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
        allowNull: false,
        defaultValue: 0,
        comment: '0=>notManager,1=>manager'
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
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
    energy_last_updated: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: "2021-04-13"
    },
    job_emoji_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    job_comments: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    last_goal_reminder_datetime: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
        defaultValue: "2021-08-01"
    },
    employee_rank_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    first_name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    last_name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    address: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    technical_skills: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
        allowNull: true
    },
    qualifications: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.JSONB),
        allowNull: true,
    },
    educations: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.JSONB),
        allowNull: true,
    },
    references: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
        allowNull: true
    },
    previous_employment_history: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
}, {
    tableName: "employee"
});
exports.employeeModel.sync({ alter: true });
//# sourceMappingURL=employee.js.map