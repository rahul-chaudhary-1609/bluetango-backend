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
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    status: {//applicable for all type of users
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: '0=>inactive,1=>active,2=>deleted'
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
    }
},
    {
        tableName: "employers"
    }
);
employersModel.sync({ alter: true });