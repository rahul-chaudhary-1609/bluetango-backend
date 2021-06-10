import { DataTypes } from "sequelize";

import { sequelize } from "../connection";

export const groupChatRoomModel: any = sequelize.define("group_chat_rooms", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "Team Group",
    },
    manager_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    member_ids: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
    },
    live_member_ids: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
    },
    room_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    icon_image_url: {
        type: DataTypes.STRING,
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: "0=>inactive, 1=> active"
    }
},
    {
        tableName: "group_chat_rooms"
    }
);
groupChatRoomModel.sync({ alter: false });
