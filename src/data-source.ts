import 'reflect-metadata';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: '127.0.0.1',
  port: 3306,
  username: 'ninja',
  password: 'password',
  database: 'fontsninja',
  migrations: ['./src/migrations/*.ts'],
  synchronize: false, // À désactiver en production,
});
