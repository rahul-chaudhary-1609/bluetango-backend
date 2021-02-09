import { DataTypes } from "sequelize";

import { sequelize } from "../connection";

export const managerTeamMemberModel: any = sequelize.define("manager_team_member", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    manager_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    team_member_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
},
    {
        tableName: "manager_team_member"
    }
);
managerTeamMemberModel.sync({ alter: false });
