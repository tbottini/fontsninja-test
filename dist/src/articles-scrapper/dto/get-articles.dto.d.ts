import { GetArticles } from '../articles-scrapper.service';
export declare class GetArticlesDto implements GetArticles {
    source: string;
    title?: string;
    lastId?: number;
}
