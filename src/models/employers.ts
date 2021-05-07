import { DataTypes } from "sequelize";

import { sequelize } from "../connection";

export const employersModel: any = sequelize.define("employers", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    admin_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    email: {
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
    first_time_login_datetime: {//applicable for all type of users
        type: DataTypes.DATE,
        defaultValue:"2021-04-13",
    },
    first_time_reset_password: {//applicable for all type of users
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: '0=>not first time,1=>first time'
    },
    subscription_type: {//applicable for all type of users
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: '0=>free,1=>paid'
    },
    reset_pass_otp: {
        type: DataTypes.JSONB,
        allowNull: true,
    },
    reset_pass_expiry: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    industry_type: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    thought_of_the_day: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    device_token: {
        type: DataTypes.STRING,
        allowNull: true,
    },
},
    {
        tableName: "employers"
    }
);
employersModel.sync({ alter: false });