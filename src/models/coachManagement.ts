import { DataTypes, Sequelize } from "sequelize";

import { sequelize } from "../connection";

export const coachManagementModel: any = sequelize.define("coach_management", {
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
    password: {
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
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    device_token: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: '0=>inactive,1=>active,2=>deleted'
    },
    image: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    fileName: {
        type: DataTypes.TEXT,
        allowNull: true
    }
},
    {
        tableName: "coach_management"
    }
);
coachManagementModel.sync({ alter: false });
