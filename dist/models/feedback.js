"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.feedbackModel = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = require("../connection");
exports.feedbackModel = connection_1.sequelize.define("feedback", {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    rating: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    message: {
        type: sequelize_1.DataTypes.TEXT,
    },
    feedback_type: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 4,
        comment: '1=>employee, 2=>employer, 3=>coach, 4=> other'
    },
    status: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: '0=>inactive,1=>active,2=>deleted'
    }
}, {
    tableName: "feedback"
});
exports.feedbackModel.sync({ alter: true });
//# sourceMappingURL=feedback.js.map