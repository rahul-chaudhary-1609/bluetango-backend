import { DataTypes, Sequelize } from "sequelize";

import { sequelize } from "../connection";

export const subscriptionManagementModel: any = sequelize.define("subscription_management", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    plan_name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    description: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
    },
    charge: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    duration: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: '0=>inactive,1=>active,2=>deleted'
    },
    
},
    {
        tableName: "subscription_management"
    }
);
subscriptionManagementModel.sync({ alter: false });
