import { GetArticlesDto } from './dto/get-articles.dto';
import { ArticlesScrapperService } from './articles-scrapper.service';
export declare class ArticlesScrapperController {
    private readonly articleScrapperService;
    constructor(articleScrapperService: ArticlesScrapperService);
    getArticles(query: GetArticlesDto): Promise<import("./entities/Article.entity").Article[]>;
    scrapArticles(): Promise<void>;
}
