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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticlesScrapperController = void 0;
const common_1 = require("@nestjs/common");
const get_articles_dto_1 = require("./dto/get-articles.dto");
const articles_scrapper_service_1 = require("./articles-scrapper.service");
let ArticlesScrapperController = class ArticlesScrapperController {
    constructor(articleScrapperService) {
        this.articleScrapperService = articleScrapperService;
    }
    getArticles(query) {
        return this.articleScrapperService.getNews(query);
    }
    scrapArticles() {
        return this.articleScrapperService.scrap();
    }
};
exports.ArticlesScrapperController = ArticlesScrapperController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_articles_dto_1.GetArticlesDto]),
    __metadata("design:returntype", void 0)
], ArticlesScrapperController.prototype, "getArticles", null);
__decorate([
    (0, common_1.Post)('scrap'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ArticlesScrapperController.prototype, "scrapArticles", null);
exports.ArticlesScrapperController = ArticlesScrapperController = __decorate([
    (0, common_1.Controller)('articles'),
    __metadata("design:paramtypes", [articles_scrapper_service_1.ArticlesScrapperService])
], ArticlesScrapperController);
//# sourceMappingURL=articles-scrapper.controller.js.map