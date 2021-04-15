"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.achievementCommentModel = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = require("../connection");
exports.achievementCommentModel = connection_1.sequelize.define("achievement_comments", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    commented_by_employee_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    achievement_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    comment: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    commented_by_employee_details: {
        type: sequelize_1.DataTypes.JSON,
    },
    status: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: '0=>inactive,1=>active,2=>deleted'
    }
}, {
    tableName: "achievement_comments"
});
exports.achievementCommentModel.sync({ alter: true });
//# sourceMappingURL=achievementComment.js.map