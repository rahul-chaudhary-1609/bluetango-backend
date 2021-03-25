"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatRealtionMappingInRoomModel = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = require("../connection");
exports.chatRealtionMappingInRoomModel = connection_1.sequelize.define("chat_relation_mapping_in_room", {
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
        comment: "0=>inActive, 1=> active"
    }
}, {
    tableName: "chat_relation_mapping_in_room"
});
exports.chatRealtionMappingInRoomModel.sync({ alter: false });
//# sourceMappingURL=chatRelationMappingInRoom.js.map