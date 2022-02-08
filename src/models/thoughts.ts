import { DataTypes, Sequelize } from "sequelize";

import { sequelize } from "../connection";

export const thoughtsModel: any = sequelize.define("thoughts", {
    day: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    thought: {
        type: DataTypes.STRING,
        allowNull: true,
    }
},
    {
        tableName: "thoughts"
    }
);
thoughtsModel.sync({ alter: true });