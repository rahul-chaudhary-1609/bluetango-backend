import { DataTypes } from "sequelize";

import { sequelize } from "../connection";

export const adminModel: any = sequelize.define("admins", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    admin_role: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 2,
        comment: '1=>super_admin/2=>sub_admin'
    },
    reset_pass_otp: {
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
    thought_of_the_day: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    reset_pass_expiry: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    status: {//applicable for all type of users
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: '0=>inactive,1=>active,2=>deleted'
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    token: {
        type: DataTypes.STRING(600),
        allowNull: true,
    },
    permissions: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true
    }
},
    {
        tableName: "admins"
    }
);
adminModel.sync({ alter: false });