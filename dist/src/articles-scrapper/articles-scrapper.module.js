"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticlesScrapperModule = void 0;
const common_1 = require("@nestjs/common");
const articles_scrapper_service_1 = require("./articles-scrapper.service");
const Article_entity_1 = require("./entities/Article.entity");
const typeorm_1 = require("@nestjs/typeorm");
const articles_scrapper_controller_1 = require("./articles-scrapper.controller");
let ArticlesScrapperModule = class ArticlesScrapperModule {
};
exports.ArticlesScrapperModule = ArticlesScrapperModule;
exports.ArticlesScrapperModule = ArticlesScrapperModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([Article_entity_1.Article])],
        providers: [articles_scrapper_service_1.ArticlesScrapperService],
        controllers: [articles_scrapper_controller_1.ArticlesScrapperController],
    })
], ArticlesScrapperModule);
//# sourceMappingURL=articles-scrapper.module.js.map