import { Article } from '../entities/Article.entity';

export type ArticleContent = Pick<
  Article,
  'title' | 'url' | 'publicationDate' | 'source' | 'sourceId'
>;

export class ArticlesExtractor {
  constructor(
    private readonly options: { articlesPerPage: number; limit: number } = {
      articlesPerPage: 30,
      limit: 10000,
    },
  ) {}

  shouldScrapNextPage = true;

  private setScrapping(value: boolean) {
    if (!this.shouldScrapNextPage) {
      return;
    }
    this.shouldScrapNextPage = value;
  }

  private totalArticlesScapped = 0;
  private lastSourceId: number | undefined;

  getNextPageUrl(): string {
    if (!this.lastSourceId) {
      return 'https://news.ycombinator.com/newest';
    }
    return `https://news.ycombinator.com/newest?next=${this.lastSourceId}`;
  }

  extractNewArticles(
    pageContent: string,
    lastArticleSaved: ArticleContent | null,
  ) {
    const htmlArticles = this.getArticlesHtmlFromPage(pageContent);
    if (!htmlArticles.length) {
      this.shouldScrapNextPage = false;
      return [];
    }
    let articles = htmlArticles.map((articleHtml) =>
      this.extractDataFromArticleHtml(articleHtml),
    );

    this.totalArticlesScapped += articles.length;
    articles = articles.filter((article) => article !== null);
    this.setScrapping(
      this.totalArticlesScapped < this.options.limit &&
        htmlArticles.length === this.options.articlesPerPage,
    );

    this.lastSourceId = articles[articles.length - 1].sourceId;

    // We remove null article after the count of articles due to the limit checking
    return this.removeArticlesAlreadySaved(articles, lastArticleSaved);
  }

  private getArticlesHtmlFromPage(pageContent: string): string[] {
    const everything = `[\\s\\S]*?`;
    const openTrWithClass = `<tr[^>]*class=["']athing submission['"][^>]*>`;
    const openTr = `<tr[^>]*>`;
    const closeTr = `<\\/tr>`;
    const whitespaces = `\\s*`;
    const regexForGroupExtraction = new RegExp(
      `${everything}${openTrWithClass}${everything}${closeTr}${whitespaces}${openTr}${everything}${closeTr}`,
      'g',
    );

    return pageContent.match(regexForGroupExtraction) ?? [];
  }

  private extractDataFromArticleHtml(
    articleHtml: string,
  ): ArticleContent | null {
    const titleMatch = articleHtml.match(
      /<span class="titleline"><a[^>]*>(.*?)<\/a>/,
    );
    const urlMatch = articleHtml.match(
      /<span class="titleline"><a[^>]*href=['"](.*?)['"]/,
    );
    const idMatch = articleHtml.match(/<tr[^>]*id=["'](\d+)["']/);

    const dateMatch = articleHtml.match(
      /<span class="age"[^>]*title=['"](.*?)['"]/,
    );

    const title = titleMatch ? titleMatch[1] : null;
    const url = urlMatch ? urlMatch[1] : null;
    const rawDate = dateMatch ? dateMatch[1].split(' ')[0] : null;
    const id = idMatch ? parseInt(idMatch[1]) : null;

    const data = { title, url, rawDate, id };
    if (Object.values(data).some((d) => !d)) {
      console.warn(
        `Missing data during the extraction of article :  ${Object.entries(data)
          .filter(([, value]) => !value)
          .map(([key]) => key)
          .join(', ')}, article : ${articleHtml}`,
      );
      return null;
    }
    return {
      title,
      url,
      publicationDate: new Date(rawDate),
      source: 'ycombinator',
      sourceId: id,
    };
  }

  private removeArticlesAlreadySaved(
    articles: ArticleContent[],
    lastArticleSaved: ArticleContent,
  ) {
    if (!lastArticleSaved) {
      return articles;
    }
    const lastArticleIndex = articles.findIndex(
      (article) => article.sourceId === lastArticleSaved.sourceId,
    );
    if (lastArticleIndex !== -1) {
      articles.splice(lastArticleIndex);
      this.setScrapping(false);
    }

    return articles;
  }
}
