import 'reflect-metadata';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME || 'ninja',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_DATABASE || 'fontsninja',
  migrations: ['./src/migrations/*.ts'],
  synchronize: false, // À désactiver en production,
});
