import { DataTypes } from "sequelize";

import { sequelize } from "../connection";

export const bluetangoChatRoomModel: any = sequelize.define("bluetango_chat_rooms", {
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
    other_user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    room_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: "0=>inactive, 1=> active"
    },
    info: {
        type: DataTypes.ARRAY(DataTypes.JSONB),
    }
},
    {
        tableName: "bluetango_chat_rooms"
    }
);
bluetangoChatRoomModel.sync({ alter: true });
