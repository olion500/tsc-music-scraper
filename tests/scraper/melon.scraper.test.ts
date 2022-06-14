import MelonScraper from '@/melon.scraper';
import { BaseScraper } from '@/base.scraper';

describe('Melon Scraper is defined', () => {
  it('should the scraper is instance of BaseScraper', () => {
    const scraper = new MelonScraper();
    expect(scraper).toBeInstanceOf(BaseScraper);
  });

  it('should all functions are implemented', () => {
    const scraper = new MelonScraper();
    expect(scraper.get).toBeDefined();
    expect(scraper.extractSummary).toBeDefined();
    expect(scraper.extractRows).toBeDefined();
  });
});

describe('Melon Scraper getUrl', () => {
  it('should return one url', () => {
    const scraper = new MelonScraper();
    scraper.getUrls().then(urls => {
      expect(urls).toBeInstanceOf(Array);
      expect(urls.length).toBe(1);
    });
  });

  it('should return base url', () => {
    const scraper = new MelonScraper();
    scraper.getUrls().then(urls => {
      const url = urls[0];
      expect(url).toBe(scraper.baseUrl);
    });
  });
});

describe('Melon Scraper extractRows', () => {
  it('should return empty list on empty input', () => {
    const html = '';
    const scraper = new MelonScraper();
    expect(scraper.extractRows(html)).toStrictEqual([]);
  });

  it('should return one element list on one tr body', () => {
    const html = `
    <table>
      <tr id="lst50">
        <td>name</td>
        <td>id</td>
      </tr>
    </table>
    `;
    const scraper = new MelonScraper();
    const res = scraper.extractRows(html);
    expect(res.length).toBe(1);
    expect(res[0]).toContain('name');
    expect(res[0]).toContain('id');
  });

  it('should return two element list on two tr body', () => {
    const html = `
    <table>
      <tr id="lst50">
        <td>1</td>
        <td>2</td>
      </tr>
      <tr id="lst50">
        <td>3</td>
        <td>4</td>
      </tr>
    </table>
    `;
    const scraper = new MelonScraper();
    const res = scraper.extractRows(html);
    expect(res.length).toBe(2);

    const [firstRow, secondRow] = res as [string, string];
    expect(firstRow).toContain('1');
    expect(firstRow).toContain('2');
    expect(secondRow).toContain('3');
    expect(secondRow).toContain('4');
  });

  it('should work on two different id of tr', () => {
    const html = `
    <table>
      <tr id="lst50">
        <td>1</td>
        <td>2</td>
        
      </tr>
      <tr id="lst100">
        <td>3</td>
        <td>4</td>
      </tr>
    </table>
    `;
    const scraper = new MelonScraper();
    const res = scraper.extractRows(html);
    expect(res.length).toBe(2);

    const [firstRow, secondRow] = res as [string, string];
    expect(firstRow).toContain('1');
    expect(firstRow).toContain('2');
    expect(secondRow).toContain('3');
    expect(secondRow).toContain('4');
  });
});

describe('Melon Scraper extractData', () => {
  it('should return 0 or empty for empty input', () => {
    const scraper = new MelonScraper();
    const music = scraper.extractSummary('');
    expect(music.ranking).toBe(0);
    expect(music.name).toBe('');
    expect(music.singer).toBe('');
    expect(music.album).toBe('');
  });

  it('should return music with ranking', () => {
    const rowHtml = `
        <td><div class="t_center"><span class="rank">1</span><span class="none">위</span></div></td>
    `;
    const scraper = new MelonScraper();
    const music = scraper.extractSummary(rowHtml);
    expect(music.ranking).toBe(1);
  });

  it('should return music with name', () => {
    const rowHtml = `
        <td>
          <div class="wrap_song_info">
            <div class="ellipsis rank01">
              <span>
                <a>TOMBOY</a>
              </span>
            </div>
          </div>
        </td>
    `;
    const scraper = new MelonScraper();
    const music = scraper.extractSummary(rowHtml);
    expect(music.name).toBe('TOMBOY');
  });

  it('should return music with singer', () => {
    const rowHtml = `
        <td>
          <div class="wrap_song_info">
            <div class="ellipsis rank01">
              <span>
                <a>TOMBOY</a>
              </span>
            </div>
            <div class="ellipsis rank02">
              <a>(여자)아이들</a>
            </div>
          </div>
        </td>
    `;
    const scraper = new MelonScraper();
    const music = scraper.extractSummary(rowHtml);
    expect(music.singer).toBe('(여자)아이들');
  });

  it('should return music with multiple singers', () => {
    const rowHtml = `
        <td>
          <div class="wrap_song_info">
            <div class="ellipsis rank01">
              <span>
                <a>TOMBOY</a>
              </span>
            </div>
            <div class="ellipsis rank02">
              <a>경서예지</a>, <a>전건호</a>
            </div>
          </div>
        </td>
    `;
    const scraper = new MelonScraper();
    const music = scraper.extractSummary(rowHtml);
    expect(music.singer).toBe('경서예지, 전건호');
  });

  it('should return music with album', () => {
    const rowHtml = `
        <td>
          <div class="wrap_song_info">
            <div class="ellipsis rank03">
              <a>ZOOM</a>
            </div>
          </div>
        </td>
    `;
    const scraper = new MelonScraper();
    const music = scraper.extractSummary(rowHtml);
    expect(music.album).toBe('ZOOM');
  });
});
