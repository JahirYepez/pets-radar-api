import { envs } from "src/config/envs";
import { DataSource, DataSourceOptions } from "typeorm";
import { LostPet } from "./entities/lost-pets.entity";
import { FoundPet } from "./entities/found-pets.entity";

export const dataSourceOptions : DataSourceOptions = {
    host: envs.DB_HOST,
    type: 'postgres',
    port: envs.DB_PORT,
    database: envs.DB_NAME,
    password: envs.DB_PASSWORD,
    entities: [
        LostPet,
        FoundPet
    ],
    synchronize: false,
    migrations: []
}

export const dataSource = new DataSource(dataSourceOptions);