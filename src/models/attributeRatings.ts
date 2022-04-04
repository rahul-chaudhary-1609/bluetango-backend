import { DataTypes } from "sequelize";

import { sequelize } from "../connection";

export const attributeRatingModel: any = sequelize.define("attributeRatings", {
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
    employee_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    start_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    end_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    ratings: {
        type: DataTypes.ARRAY(DataTypes.JSON),
        allowNull:false,
    },

},
    {
        tableName: "attributeRatings"
    }
);
attributeRatingModel.sync({ alter: true });
