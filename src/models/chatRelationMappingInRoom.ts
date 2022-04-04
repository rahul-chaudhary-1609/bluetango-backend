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
    type: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: "0=>employee, 1=> coach, 2=> group, 3=> BT_admin"
    },
    chat_session_id: {
        type:DataTypes.STRING,
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
        tableName: "chat_relation_mapping_in_room"
    }
);
chatRealtionMappingInRoomModel.sync({ alter: false });
