"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.achievementLikeModel = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = require("../connection");
exports.achievementLikeModel = connection_1.sequelize.define("achievement_likes", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    liked_by_employee_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    achievement_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    liked_by_employee_details: {
        type: sequelize_1.DataTypes.JSON,
    },
    status: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: '0=>inactive,1=>active,2=>deleted'
    }
}, {
    tableName: "achievement_likes"
});
exports.achievementLikeModel.sync({ alter: true });
//# sourceMappingURL=achievementLike.js.map