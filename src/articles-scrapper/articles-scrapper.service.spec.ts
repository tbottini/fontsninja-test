import { Test, TestingModule } from '@nestjs/testing';
import { ArticlesScrapperService } from './articles-scrapper.service';

describe('NewsScrapperService', () => {
  let service: ArticlesScrapperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArticlesScrapperService],
    }).compile();

    service = module.get<ArticlesScrapperService>(ArticlesScrapperService);
  });

  it('should scrap the content', () => {
    expect(service).toBeDefined();
  });
});
