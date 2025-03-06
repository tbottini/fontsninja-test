import { Article } from '../entities/Article.entity';
export type ArticleContent = Pick<Article, 'title' | 'url' | 'publicationDate' | 'source' | 'sourceId'>;
export declare class ArticlesExtractor {
    private readonly options;
    constructor(options?: {
        articlesPerPage: number;
        limit: number;
    });
    shouldScrapNextPage: boolean;
    private setScrapping;
    private totalArticlesScapped;
    private lastSourceId;
    getNextPageUrl(): string;
    extractNewArticles(pageContent: string, lastArticleSaved: ArticleContent | null): ArticleContent[];
    private getArticlesHtmlFromPage;
    private extractDataFromArticleHtml;
    private removeArticlesAlreadySaved;
}
