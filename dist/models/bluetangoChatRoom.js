"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bluetangoChatRoomModel = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = require("../connection");
exports.bluetangoChatRoomModel = connection_1.sequelize.define("bluetango_chat_rooms", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    other_user_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    room_id: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: false,
    },
    status: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: "0=>inactive, 1=> active"
    },
    info: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.JSONB),
    }
}, {
    tableName: "bluetango_chat_rooms"
});
exports.bluetangoChatRoomModel.sync({ alter: true });
//# sourceMappingURL=bluetangoChatRoom.js.map