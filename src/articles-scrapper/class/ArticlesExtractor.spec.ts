import { Article } from '../entities/Article.entity';
import { ArticleContent, ArticlesExtractor } from './ArticlesExtractor';

describe('ArticleExtractor', () => {
  const defaultPage =
    buildHtmlArticle({
      title: 'title1',
      url: 'url1',
      publicationDate: new Date(),
      sourceId: 1000,
    }) +
    buildHtmlArticle({
      title: 'title2',
      url: 'url2',
      publicationDate: new Date(),
      sourceId: 1001,
    });

  it('should extract articles from the content', () => {
    const extractor = new ArticlesExtractor({
      articlesPerPage: 2,
      limit: 10000,
    });

    const articles = extractor.extractNewArticles(defaultPage, null);

    expect(articles).toEqual([
      buildArticle({
        title: 'title1',
        url: 'url1',
        publicationDate: expect.any(Date),
        sourceId: 1000,
      }),
      buildArticle({
        title: 'title2',
        url: 'url2',
        publicationDate: expect.any(Date),
        sourceId: 1001,
      }),
    ]);
    expect(extractor.shouldScrapNextPage).toBe(true);
    expect(extractor.getNextPageUrl()).toEqual(
      `https://news.ycombinator.com/newest?next=${1001}`,
    );
  });

  it('should stop scrapping when there is no more articles', () => {
    const extractor = new ArticlesExtractor();

    const page = '';

    const articles = extractor.extractNewArticles(page, null);
    expect(articles).toEqual([]);

    expect(extractor.shouldScrapNextPage).toBe(false);
  });

  it('should stop scrapping when the limit is reached', () => {
    const extractor = new ArticlesExtractor({ limit: 1, articlesPerPage: 2 });

    const articles = extractor.extractNewArticles(defaultPage, null);

    expect(articles).toHaveLength(2);
    expect(extractor.shouldScrapNextPage).toBe(false);
  });

  it('should stop scrapping when the last article is reached', () => {
    const lastArticle = buildArticle({
      title: 'title2',
      url: 'url2',
      publicationDate: new Date(),
      sourceId: 1001,
    });

    const extractor = new ArticlesExtractor({
      limit: 1000, // pour ne pas avoir la limite qui stoppe le scrapping
      articlesPerPage: 2,
    });
    const articles = extractor.extractNewArticles(defaultPage, lastArticle);

    expect(articles).toEqual([
      buildArticle({
        title: 'title1',
        url: 'url1',
        publicationDate: expect.any(Date),
        sourceId: 1000,
      }),
    ]);
    expect(extractor.shouldScrapNextPage).toBe(false);
  });

  it('should not stop scrapping when an article is not well formatted', () => {
    const notWellFormattedData = 'qsmdflqsjkfml';

    const page =
      buildHtmlArticle({
        title: 'title1',
        url: 'url1',
        publicationDate: new Date(),
        sourceId: 1000,
      }) +
      `
        <tr class='athing submission' id="qsmflqkj">
      <td align="right" valign="top" class="title"><span class="rank">1.</span></td>      <td valign="top" class="votelinks"><center><a id='up_43265555' href='vote?id=43265555&amp;how=up&amp;goto=newest'><div class='votearrow' title='upvote'></div></a></center></td><td class="title"><span class="titleline"><a href="${notWellFormattedData}" rel="nofollow">${notWellFormattedData}</a><span class="sitebit comhead"> (<a href="from?site=rubykaigi.org"><span class="sitestr">rubykaigi.org</span></a>)</span></span></td></tr><tr><td colspan="2"></td><td class="subtext"><span class="subline">
          <span class="score" id="score_43265555">1 point</span> by <a href="user?id=ksec" class="hnuser">ksec</a> <span class="age" title="${notWellFormattedData} 1741176754"><a href="item?id=43265555">0 minutes ago</a></span> <span id="unv_43265555"></span> | <a href="hide?id=43265555&amp;goto=newest">hide</a> | <a href="https://hn.algolia.com/?query=ZJIT%3A%20Building%20a%20Next%20Generation%20Ruby%20JIT&type=story&dateRange=all&sort=byDate&storyText=false&prefix&page=0" class="hnpast">past</a> | <a href="item?id=43265555">discuss</a>        </span>
              </td></tr>
      <tr class="spacer" style="height:5px"></tr>
      
      `;

    const extractor = new ArticlesExtractor({
      limit: 1000,
      articlesPerPage: 2,
    });
    const articles = extractor.extractNewArticles(page, null);
    expect(articles).toEqual([
      buildArticle({
        title: 'title1',
        url: 'url1',
        publicationDate: expect.any(Date),
        sourceId: 1000,
      }),
    ]);
  });
});

function buildArticle(article: Partial<ArticleContent>): ArticleContent {
  return {
    title: 'title',
    url: 'url',
    publicationDate: new Date(),
    source: 'ycombinator',
    sourceId: 1000,
    ...article,
  };
}

function buildHtmlArticle(article: Omit<Article, 'id' | 'source'>): string {
  return `
    
                <tr class='athing submission' id="${article.sourceId}">
      <td align="right" valign="top" class="title"><span class="rank">1.</span></td>      <td valign="top" class="votelinks"><center><a id='up_43265555' href='vote?id=43265555&amp;how=up&amp;goto=newest'><div class='votearrow' title='upvote'></div></a></center></td><td class="title"><span class="titleline"><a href="${article.url}" rel="nofollow">${article.title}</a><span class="sitebit comhead"> (<a href="from?site=rubykaigi.org"><span class="sitestr">rubykaigi.org</span></a>)</span></span></td></tr><tr><td colspan="2"></td><td class="subtext"><span class="subline">
          <span class="score" id="score_43265555">1 point</span> by <a href="user?id=ksec" class="hnuser">ksec</a> <span class="age" title="${article.publicationDate.toISOString()} 1741176754"><a href="item?id=43265555">0 minutes ago</a></span> <span id="unv_43265555"></span> | <a href="hide?id=43265555&amp;goto=newest">hide</a> | <a href="https://hn.algolia.com/?query=ZJIT%3A%20Building%20a%20Next%20Generation%20Ruby%20JIT&type=story&dateRange=all&sort=byDate&storyText=false&prefix&page=0" class="hnpast">past</a> | <a href="item?id=43265555">discuss</a>        </span>
              </td></tr>
      <tr class="spacer" style="height:5px"></tr>
      
    `;
}
