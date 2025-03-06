import { Injectable } from '@nestjs/common';
import { FindOptionsWhere, ILike, LessThanOrEqual, Repository } from 'typeorm';
import { Article } from './entities/Article.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticlesExtractor } from './class/ArticlesExtractor';
import { timeoutInSeconds } from './timeout.util';

export type GetArticles = {
  source: string;
  title?: string;
  lastId?: number;
};

@Injectable()
export class ArticlesScrapperService {
  static SOURCE = 'ycombinator';

  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
  ) {}

  async getNews(query: GetArticles) {
    console.log('Will get news with query', query);
    const filters: FindOptionsWhere<Article> = {
      source: query.source,
    };

    if (query.title) {
      filters.title = ILike(`%${query.title}%`);
    }

    if (query.lastId) {
      const lastArticle = await this.articleRepository.findOne({
        where: {
          id: query.lastId,
        },
      });
      if (!lastArticle) {
        throw new Error('Article not found with the lastId : ' + query.lastId);
      }
      filters.publicationDate = LessThanOrEqual(lastArticle.publicationDate);
    }

    const queryBuilder = this.articleRepository
      .createQueryBuilder('article')
      .where(filters)
      .orderBy('article.publicationDate', 'DESC')
      .take(100);

    console.log(
      'Generated SQL:',
      queryBuilder.getSql(),
      'with parameters',
      queryBuilder.getParameters(),
    );

    return queryBuilder.getMany();
  }

  async delete() {
    await this.articleRepository.delete({
      source: ArticlesScrapperService.SOURCE,
    });
  }

  async scrap() {
    const lastArticle = await this.articleRepository.findOne({
      where: {
        source: ArticlesScrapperService.SOURCE,
      },
      order: {
        publicationDate: 'DESC',
      },
    });

    const articlesExtractor = new ArticlesExtractor();
    let totalNewArticles = 0;
    while (articlesExtractor.shouldScrapNextPage) {
      console.log(
        `Will scrap ${articlesExtractor.getNextPageUrl()}, last article id : ${lastArticle?.id}`,
      );
      const htmlPageContent = await fetch(
        articlesExtractor.getNextPageUrl(),
      ).then((res) => res.text());
      const articles = articlesExtractor
        .extractNewArticles(htmlPageContent, lastArticle)
        .map((article) => {
          return this.articleRepository.create(article);
        });
      totalNewArticles += articles.length;
      await this.articleRepository.save(articles);
      await timeoutInSeconds(1);
    }

    console.log(`Scrapping done, ${totalNewArticles} articles scrapped`);
  }
}
