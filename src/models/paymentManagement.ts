import { DataTypes, Sequelize } from "sequelize";

import { sequelize } from "../connection";

export const paymentManagementModel: any = sequelize.define("payment_management", {
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
    employer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    plan_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    purchase_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    expiry_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    transaction_id: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: '0=>inactive,1=>active,2=>deleted'
    },
    
},
    {
        tableName: "payment_management"
    }
);
paymentManagementModel.sync({ alter: true });
