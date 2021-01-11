import * as dotenv from "dotenv";
dotenv.config();
import {Sequelize} from "sequelize";

import { sequelizeTransforms } from 'sequelize-transforms'

export const sequelize =
    new Sequelize(process.env.DB_DATABASE_NAME, process.env.DB_USER_NAME, process.env.DB_PASSWORD, {
        host: process.env.DB_HOST,
        dialect: "postgres",
        port: Number(process.env.DB_PORT),
        define: {
            timestamps: true,
        },
    });


/* funcion for initiating Database connection */    
export const initDbConnection = async () => {
    try {
        await sequelize.authenticate();
        sequelizeTransforms(sequelize);
    } catch (e) {
        throw e;
    }
};


export const rawQuery = (query, replacements) => {
    return sequelize.query(query, replacements);
};