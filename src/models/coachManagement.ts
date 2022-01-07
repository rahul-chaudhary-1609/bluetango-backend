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
    first_time_login: {//applicable for all type of users
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: '0=>not first time,1=>first time'
    },
    first_time_login_datetime: {//applicable for all type of users
        type: DataTypes.DATE,
        defaultValue: "2021-04-13",
    },
    first_time_reset_password: {//applicable for all type of users
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: '0=>not first time,1=>first time'
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
    },
    coach_specialization_category_ids:{
        type:DataTypes.ARRAY(DataTypes.INTEGER),
    },
    employee_rank_ids:{
        type:DataTypes.ARRAY(DataTypes.INTEGER),
    },
    coach_charge:{
        type:DataTypes.DECIMAL(15,2),
        allowNull:false,
        defaultValue:0,
    },
    app_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: '1=>BX,2=>BT'
    },

},
    {
        tableName: "coach_management"
    }
);
coachManagementModel.sync({ alter: true });
