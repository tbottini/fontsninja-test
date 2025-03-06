import { Module } from '@nestjs/common';
import { ArticlesScrapperService } from './articles-scrapper.service';
import { Article } from './entities/Article.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticlesScrapperController } from './articles-scrapper.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Article])],
  providers: [ArticlesScrapperService],
  controllers: [ArticlesScrapperController],
})
export class ArticlesScrapperModule {}
