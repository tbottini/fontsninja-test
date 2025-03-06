"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticlesExtractor = void 0;
class ArticlesExtractor {
    constructor(options = {
        articlesPerPage: 30,
        limit: 10000,
    }) {
        this.options = options;
        this.shouldScrapNextPage = true;
        this.totalArticlesScapped = 0;
    }
    setScrapping(value) {
        if (!this.shouldScrapNextPage) {
            return;
        }
        this.shouldScrapNextPage = value;
    }
    getNextPageUrl() {
        if (!this.lastSourceId) {
            return 'https://news.ycombinator.com/newest';
        }
        return `https://news.ycombinator.com/newest?next=${this.lastSourceId}`;
    }
    extractNewArticles(pageContent, lastArticleSaved) {
        const htmlArticles = this.getArticlesHtmlFromPage(pageContent);
        if (!htmlArticles.length) {
            this.shouldScrapNextPage = false;
            return [];
        }
        let articles = htmlArticles.map((articleHtml) => this.extractDataFromArticleHtml(articleHtml));
        this.totalArticlesScapped += articles.length;
        articles = articles.filter((article) => article !== null);
        this.setScrapping(this.totalArticlesScapped < this.options.limit &&
            htmlArticles.length === this.options.articlesPerPage);
        this.lastSourceId = articles[articles.length - 1].sourceId;
        return this.removeArticlesAlreadySaved(articles, lastArticleSaved);
    }
    getArticlesHtmlFromPage(pageContent) {
        const everything = `[\\s\\S]*?`;
        const openTrWithClass = `<tr[^>]*class=["']athing submission['"][^>]*>`;
        const openTr = `<tr[^>]*>`;
        const closeTr = `<\\/tr>`;
        const whitespaces = `\\s*`;
        const regexForGroupExtraction = new RegExp(`${everything}${openTrWithClass}${everything}${closeTr}${whitespaces}${openTr}${everything}${closeTr}`, 'g');
        return pageContent.match(regexForGroupExtraction) ?? [];
    }
    extractDataFromArticleHtml(articleHtml) {
        const titleMatch = articleHtml.match(/<span class="titleline"><a[^>]*>(.*?)<\/a>/);
        const urlMatch = articleHtml.match(/<span class="titleline"><a[^>]*href=['"](.*?)['"]/);
        const idMatch = articleHtml.match(/<tr[^>]*id=["'](\d+)["']/);
        const dateMatch = articleHtml.match(/<span class="age"[^>]*title=['"](.*?)['"]/);
        const title = titleMatch ? titleMatch[1] : null;
        const url = urlMatch ? urlMatch[1] : null;
        const rawDate = dateMatch ? dateMatch[1].split(' ')[0] : null;
        const id = idMatch ? parseInt(idMatch[1]) : null;
        const data = { title, url, rawDate, id };
        if (Object.values(data).some((d) => !d)) {
            console.warn(`Missing data during the extraction of article :  ${Object.entries(data)
                .filter(([, value]) => !value)
                .map(([key]) => key)
                .join(', ')}, article : ${articleHtml}`);
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
    removeArticlesAlreadySaved(articles, lastArticleSaved) {
        if (!lastArticleSaved) {
            return articles;
        }
        const lastArticleIndex = articles.findIndex((article) => article.sourceId === lastArticleSaved.sourceId);
        if (lastArticleIndex !== -1) {
            articles.splice(lastArticleIndex);
            this.setScrapping(false);
        }
        return articles;
    }
}
exports.ArticlesExtractor = ArticlesExtractor;
//# sourceMappingURL=ArticlesExtractor.js.map