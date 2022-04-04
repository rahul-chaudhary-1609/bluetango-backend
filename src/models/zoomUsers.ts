import { DataTypes } from "sequelize";

import { sequelize } from "../connection";

export const zoomUserModel: any = sequelize.define("zoom_users", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    zoom_user_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    type: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: '1=>coach,1=>employee'
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: '0=>inactive,1=>active,2=>deleted'
    },
    details: {
        type: DataTypes.JSON,
    },
},
    {
        tableName: "zoom_users"
    }
);
zoomUserModel.sync({ alter: true });
