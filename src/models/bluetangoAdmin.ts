import { DataTypes } from "sequelize";

import { sequelize } from "../connection";

export const bluetangoAdminModel: any = sequelize.define("bluetango_admins", {
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
        type: DataTypes.STRING,
        allowNull: false,
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
    profile_pic_url: {
        type: DataTypes.TEXT,
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
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: true,
        comment: '1=>add, 2=>update, 3=>view, 4=>delete'
    },
    social_media_handles: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    module_wise_permissions:{
        type: DataTypes.ARRAY(DataTypes.JSONB),
        allowNull:true,
    },
    role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "FK to bluetango_admin_roles table"
      },
},
    {
        tableName: "bluetango_admins"
    }
);
bluetangoAdminModel.sync({ alter: true });