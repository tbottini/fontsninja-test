import { Controller, Get, Post, Query } from '@nestjs/common';
import { GetArticlesDto } from './dto/get-articles.dto';
import { ArticlesScrapperService } from './articles-scrapper.service';

@Controller('articles')
export class ArticlesScrapperController {
  constructor(
    private readonly articleScrapperService: ArticlesScrapperService,
  ) {}

  @Get()
  getArticles(@Query() query: GetArticlesDto) {
    return this.articleScrapperService.getNews(query);
  }

  @Post('scrap')
  scrapArticles() {
    return this.articleScrapperService.scrap();
  }
}
