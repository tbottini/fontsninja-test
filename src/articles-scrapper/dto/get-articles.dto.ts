import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { GetArticles } from '../articles-scrapper.service';
import { Type } from 'class-transformer';

export class GetArticlesDto implements GetArticles {
  @IsNotEmpty()
  @IsString()
  source: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  lastId?: number;
}
