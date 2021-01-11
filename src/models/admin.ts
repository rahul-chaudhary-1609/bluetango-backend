import { DataTypes } from "sequelize";

import { sequelize } from "../connection";

export const adminModel: any = sequelize.define("admins", {
    admin_id: {
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
    reset_pass_otp: {
        type: DataTypes.JSONB,
        allowNull: true,
    },
    status: {//applicable for all type of users
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: '0=>blocked,1=>active,2=>deleted'
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    token: {
        type: DataTypes.STRING,
        allowNull: true,
    }
},
    {
        tableName: "admins"
    }
);
adminModel.sync({ alter: process.env.ALTER_BOOL == 'true' });