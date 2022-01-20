import { DataTypes } from "sequelize";

import { sequelize } from "../connection";

export const bluetangoAdminRolesModel: any = sequelize.define("bluetango_admin_roles", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    role_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: '0=>inactive,1=>active'
    },
    module_wise_permissions:{
        type: DataTypes.ARRAY(DataTypes.JSONB),
        allowNull:true,
    },
    last_activity: {
        type: DataTypes.DATE,
        allowNull: true
    },
},
    {
        tableName: "bluetango_admin_roles"
    }
);
bluetangoAdminRolesModel.sync({ alter: true });
