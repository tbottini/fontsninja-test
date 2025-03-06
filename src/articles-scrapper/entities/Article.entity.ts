import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  title: string;

  // the maximal length of a URL is 2048 characters
  @Column({ type: 'varchar', length: 2048 })
  url: string;

  @Column({ type: 'datetime' })
  publicationDate: Date;

  @Column({ type: 'varchar', length: 2044 })
  source: string;

  @Column({ type: 'int' })
  sourceId: number;
}
