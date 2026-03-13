import { envs } from "src/config/envs";
import { DataSource, DataSourceOptions } from "typeorm";

export const dataSourceOptions : DataSourceOptions = {
    host: envs.DB_HOST,
    type: 'postgres',
    port: envs.DB_PORT,
    database: envs.DB_NAME,
    password: envs.DB_PASSWORD,
    entities: [],
    synchronize: false,
    migrations: []
}

export const dataSource = new DataSource(dataSourceOptions);