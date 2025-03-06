"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ArticlesScrapperService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticlesScrapperService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const Article_entity_1 = require("./entities/Article.entity");
const typeorm_2 = require("@nestjs/typeorm");
const ArticlesExtractor_1 = require("./class/ArticlesExtractor");
const timeout_util_1 = require("./timeout.util");
let ArticlesScrapperService = ArticlesScrapperService_1 = class ArticlesScrapperService {
    constructor(articleRepository) {
        this.articleRepository = articleRepository;
    }
    async getNews(query) {
        console.log('Will get news with query', query);
        const filters = {
            source: query.source,
        };
        if (query.title) {
            filters.title = (0, typeorm_1.ILike)(`%${query.title}%`);
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
            filters.publicationDate = (0, typeorm_1.LessThanOrEqual)(lastArticle.publicationDate);
        }
        const queryBuilder = this.articleRepository
            .createQueryBuilder('article')
            .where(filters)
            .orderBy('article.publicationDate', 'DESC')
            .take(100);
        console.log('Generated SQL:', queryBuilder.getSql(), 'with parameters', queryBuilder.getParameters());
        return queryBuilder.getMany();
    }
    async delete() {
        await this.articleRepository.delete({
            source: ArticlesScrapperService_1.SOURCE,
        });
    }
    async scrap() {
        const lastArticle = await this.articleRepository.findOne({
            where: {
                source: ArticlesScrapperService_1.SOURCE,
            },
            order: {
                publicationDate: 'DESC',
            },
        });
        const articlesExtractor = new ArticlesExtractor_1.ArticlesExtractor();
        let totalNewArticles = 0;
        while (articlesExtractor.shouldScrapNextPage) {
            console.log(`Will scrap ${articlesExtractor.getNextPageUrl()}, last article id : ${lastArticle?.id}`);
            const htmlPageContent = await fetch(articlesExtractor.getNextPageUrl()).then((res) => res.text());
            const articles = articlesExtractor
                .extractNewArticles(htmlPageContent, lastArticle)
                .map((article) => {
                return this.articleRepository.create(article);
            });
            totalNewArticles += articles.length;
            await this.articleRepository.save(articles);
            await (0, timeout_util_1.timeoutInSeconds)(1);
        }
        console.log(`Scrapping done, ${totalNewArticles} articles scrapped`);
    }
};
exports.ArticlesScrapperService = ArticlesScrapperService;
ArticlesScrapperService.SOURCE = 'ycombinator';
exports.ArticlesScrapperService = ArticlesScrapperService = ArticlesScrapperService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(Article_entity_1.Article)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], ArticlesScrapperService);
//# sourceMappingURL=articles-scrapper.service.js.map