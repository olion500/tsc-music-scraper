import { load } from 'cheerio';
import { BaseScraper } from '@/base.scraper';
import { MusicDetail, MusicInfo, MusicSummary } from '@/types/music';

export default class MelonScraper extends BaseScraper {
  readonly baseUrl = 'https://www.melon.com/chart/index.htm';

  readonly detailUrl = 'https://www.melon.com/album/detail.htm?albumId=';

  extractSummary(rowHtml: string): MusicSummary {
    const $ = load(rowHtml, null, false);
    return {
      album: $('div.wrap_song_info > div.rank03 > a').text(),
      ranking: Number($('td > div.t_center > span.rank').text()),
      singer: $('div.wrap_song_info > div.rank02 > a')
        .get()
        .map(e => $(e).text())
        .join(', '),
      name: $('div.wrap_song_info > div.rank01 > span > a').text(),
    };
  }

  extractRows(pageHtml: string): string[] {
    const $ = load(pageHtml);
    return $('#lst50, #lst100')
      .get()
      .map(elem => $(elem).html());
  }

  getUrls(): Promise<string[]> {
    return Promise.resolve([this.baseUrl]);
  }

  extractDetail(detailHtml: string): MusicDetail {
    const $ = load(detailHtml, null, false);
    return {
      agency: $('div.meta > dl > dd:nth-child(8)').text(),
      publisher: $('div.meta > dl > dd:nth-child(6)').text(),
    };
  }

  extractDetailUrl(rowHtml: string): string {
    const $ = load(rowHtml, null, false);
    const href = $('div.wrap_song_info > div.rank03 > a').attr('href');
    const albumId = this.extractNumber(href);
    return this.detailUrl + albumId;
  }

  extractNumber(source: string): string {
    const regex = /\d+/g;
    const matches = source.match(regex);

    if (matches) return matches[0];
    throw new Error('Cannot parse number from given string');
  }
}
