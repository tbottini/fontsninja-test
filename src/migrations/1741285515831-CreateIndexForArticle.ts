import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateIndexForArticle1741278249343 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    console.log('will create index');

    await queryRunner.query(`

       CREATE INDEX idx_articles_source_publicationDate ON article(source(255), publicationDate);

    `);
  }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`
          DROP INDEX idx_articles_source_publicationDate ON article
        `);
    }
}
