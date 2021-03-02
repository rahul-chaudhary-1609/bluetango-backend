"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emojiModel = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = require("../connection");
exports.emojiModel = connection_1.sequelize.define("emoji", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    image_url: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    caption: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    }
}, {
    tableName: "emoji"
});
exports.emojiModel.sync({ alter: false });
//# sourceMappingURL=emoji.js.map