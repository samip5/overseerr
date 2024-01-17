import 'reflect-metadata';
import type { DataSourceOptions, EntityTarget, Repository } from 'typeorm';
import { DataSource } from 'typeorm';

const sqliteDevConfig: DataSourceOptions = {
  type: 'sqlite',
  database: process.env.CONFIG_DIRECTORY
    ? `${process.env.CONFIG_DIRECTORY}/db/db.sqlite3`
    : 'config/db/db.sqlite3',
  synchronize: true,
  migrationsRun: false,
  logging: false,
  enableWAL: true,
  entities: ['server/entity/**/*.ts'],
  migrations: ['server/migration/**/*.ts'],
  subscribers: ['server/subscriber/**/*.ts'],
};

const sqliteProdConfig: DataSourceOptions = {
  type: 'sqlite',
  database: process.env.CONFIG_DIRECTORY
    ? `${process.env.CONFIG_DIRECTORY}/db/db.sqlite3`
    : 'config/db/db.sqlite3',
  synchronize: false,
  migrationsRun: false,
  logging: false,
  enableWAL: true,
  entities: ['dist/entity/**/*.js'],
  migrations: ['dist/migration/**/*.js'],
  subscribers: ['dist/subscriber/**/*.js'],
};

const postgresProdConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  migrationsRun: true,
  logging: false,
  entities: ['dist/entity/**/*.js'],
  migrations: ['dist/migration/**/*.js'],
  subscribers: ['dist/subscriber/**/*.js'],
};
const postgresDevConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  migrationsRun: false,
  logging: false,
  entities: ['dist/entity/**/*.js'],
  migrations: ['dist/migration/**/*.js'],
  subscribers: ['dist/subscriber/**/*.js'],
};

// In production, if DB_TYPE is 'postgres', it uses postgresProdConfig; otherwise, it defaults to sqliteProdConfig.
// In development (NODE_ENV !== 'production'), if DB_TYPE is 'postgres', it uses postgresDevConfig; otherwise, it defaults to sqliteDevConfig.
const dataSource = new DataSource(
  process.env.NODE_ENV === 'production'
    ? process.env.DB_TYPE === 'postgres'
      ? postgresProdConfig
      : sqliteProdConfig
    : process.env.DB_TYPE === 'postgres'
    ? postgresDevConfig
    : sqliteDevConfig
);

export const getRepository = <Entity extends object>(
  target: EntityTarget<Entity>
): Repository<Entity> => {
  return dataSource.getRepository(target);
};

export default dataSource;
