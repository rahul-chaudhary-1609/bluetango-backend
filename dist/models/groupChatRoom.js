"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupChatRoomModel = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = require("../connection");
exports.groupChatRoomModel = connection_1.sequelize.define("group_chat_rooms", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        defaultValue: "Team Group",
    },
    manager_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    member_ids: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.INTEGER),
    },
    live_member_ids: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.INTEGER),
    },
    room_id: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: false,
    },
    icon_image_url: {
        type: sequelize_1.DataTypes.STRING,
    },
    status: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: "0=>inactive, 1=> active"
    }
}, {
    tableName: "group_chat_rooms"
});
exports.groupChatRoomModel.sync({ alter: false });
//# sourceMappingURL=groupChatRoom.js.map