import { DataTypes } from "sequelize";

import { sequelize } from "../connection";

export const notificationModel: any = sequelize.define("notification", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    type_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    team_goal_assign_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    team_goal_assign_completion_by_employee_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    sender_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    reciever_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    type: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: "0=> other, 1=> assign new goal, 2=>goal complete, 3=> rating, 4=>message, 5=>audio chat, 6=>video chat, 7=>goal accecpt, 8=>goal reject,9=>chat_disconnect, 10=>expiration_of_free_trial "
    },
    data: {
        type: DataTypes.JSON,
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: '0=>inactive,1=>active,2=>deleted'
    }
},
    {
        tableName: "notification"
    }
);
notificationModel.sync({ alter: false });
