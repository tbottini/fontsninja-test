"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateIndexForArticle1741278249343 = void 0;
class CreateIndexForArticle1741278249343 {
    async up(queryRunner) {
        await queryRunner.query(`

       CREATE INDEX idx_articles_source_publicationDate ON article(source(255), publicationDate);

    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
        DROP INDEX idx_articles_source_publicationDate;
      `);
    }
}
exports.CreateIndexForArticle1741278249343 = CreateIndexForArticle1741278249343;
//# sourceMappingURL=1741278249343-CreateIndexForArticles.js.map