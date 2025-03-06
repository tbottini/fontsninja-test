import { Repository } from 'typeorm';
import { Article } from './entities/Article.entity';
export type GetArticles = {
    source: string;
    title?: string;
    lastId?: number;
};
export declare class ArticlesScrapperService {
    private readonly articleRepository;
    static SOURCE: string;
    constructor(articleRepository: Repository<Article>);
    getNews(query: GetArticles): Promise<Article[]>;
    delete(): Promise<void>;
    scrap(): Promise<void>;
}
