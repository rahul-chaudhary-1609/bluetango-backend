import { DataTypes } from "sequelize";

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
        allowNull: true,
    },
    current_date_of_joining: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    prev_employer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    prev_department_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    prev_designation: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    prev_date_of_joining: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    prev_exit: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    date_of_birth: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    employee_code: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    profile_pic_url: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    country_code: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    phone_number: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    status: {//applicable for all type of users
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: '0=>inactive,1=>active,2=>deleted'
    },
    is_manager: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
        comment: '0=>notManager,1=>manager'
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    Accomplishments: {
        type: DataTypes.TEXT,
        allowNull: true,
    }
},
    {
        tableName: "employee"
    }
);
employeeModel.sync({ alter: true });
