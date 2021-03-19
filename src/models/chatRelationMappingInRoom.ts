import { DataTypes } from "sequelize";

import { sequelize } from "../connection";

export const chatRealtionMappingInRoomModel: any = sequelize.define("chat_relation_mapping_in_room", {
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
        comment: "0=>inActive, 1=> active"
    }
},
    {
        tableName: "chat_relation_mapping_in_room"
    }
);
chatRealtionMappingInRoomModel.sync({ alter: false });
