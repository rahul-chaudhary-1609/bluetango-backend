import { DataTypes, Sequelize } from "sequelize";

import { sequelize } from "../connection";

export const employeeModel: any = sequelize.define("employee", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    current_employer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    current_department_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    current_designation: {
        type: DataTypes.STRING,
    },
    current_date_of_joining: {
        type: DataTypes.DATE,
        allowNull: true
    },
    prev_employer: {
        type: DataTypes.STRING,
    },
    prev_department: {
        type: DataTypes.STRING,
    },
    prev_designation: {
        type: DataTypes.STRING,
    },
    prev_date_of_joining: {
        type: DataTypes.DATE,
    },
    prev_exit: {
        type: DataTypes.DATE,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    date_of_birth: {
        type: DataTypes.DATEONLY,
    },
    employee_code: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    profile_pic_url: {
        type: DataTypes.STRING,
    },
    country_code: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone_number: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: '0=>inactive,1=>active,2=>deleted'
    },
    first_time_login: {//applicable for all type of users
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: '0=>not first time,1=>first time'
    },
    first_time_reset_password: {//applicable for all type of users
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: '0=>not first time,1=>first time'
    },
    is_manager: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '0=>notManager,1=>manager'
    },
    password: {
        type: DataTypes.STRING,
    },
    accomplishments: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    device_token: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    thought_of_the_day: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    energy_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    energy_last_updated: {
        type: DataTypes.DATE,
        defaultValue: "2021-04-13"
    },
    job_emoji_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    job_comments: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    last_goal_reminder_datetime: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: "2021-08-01"
    },
},
    {
        tableName: "employee"
    }
);
employeeModel.sync({ alter: false });
