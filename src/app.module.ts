import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticlesScrapperModule } from './articles-scrapper/articles-scrapper.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'ninja',
      password: 'password',
      database: 'fontsninja',
      migrations: ['./dist/src/migrations/*.ts'],
      synchronize: false, // À désactiver en production,
    }),
    ArticlesScrapperModule,
  ],
})
export class AppModule {}
