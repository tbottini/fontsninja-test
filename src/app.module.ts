import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticlesScrapperModule } from './articles-scrapper/articles-scrapper.module';
import { Article } from './articles-scrapper/entities/Article.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || '127.0.0.1',
      port: parseInt(process.env.DB_PORT || '3306'),
      username: process.env.DB_USERNAME || 'ninja',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_DATABASE || 'fontsninja',
      entities: [Article],
      migrations: ['./dist/src/migrations/*.ts'],
      synchronize: false, // À désactiver en production,
    }),
    ArticlesScrapperModule,
  ],
})
export class AppModule {}
