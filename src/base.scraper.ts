import axios from 'axios';
import { MusicDetail, MusicInfo, MusicSummary } from '@/types/music';

export function getPageHtml(url: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    axios.get(url).then(resp => {
      resolve(resp.data);
    });
  });
}

export abstract class BaseScraper {
  get(): Promise<MusicInfo[]> {
    return this.getUrls().then(urls => {
      const pagePromise = urls.map(url => getPageHtml(url));
      const rowPromise = Promise.all(pagePromise).then(pages => {
        const rows = pages.map(page => this.extractRows(page));
        return [].concat(...rows);
      });
      const summaryPromise = this.getSummary(rowPromise);
      const detailPromise = this.getDetail(rowPromise);

      return Promise.all([summaryPromise, detailPromise]).then(data => {
        const summaryList = data[0];
        const detailList = data[1];
        return summaryList.map((value, index) => Object.assign(value, detailList[index]));
      });
    });
  }

  getSummary(rowPromise: Promise<string[]>): Promise<MusicSummary[]> {
    return rowPromise.then(rows => rows.map(row => this.extractSummary(row)));
  }

  getDetail(rowPromise: Promise<string[]>): Promise<MusicDetail[]> {
    return rowPromise
      .then(rows => rows.map(row => this.extractDetailUrl(row)))
      .then(detailUrls => detailUrls.map(url => getPageHtml(url)))
      .then(detailPagePromise =>
        Promise.all(detailPagePromise).then(detailPages =>
          detailPages.map(detailPage => this.extractDetail(detailPage)),
        ),
      );
  }

  abstract getUrls(): Promise<string[]>;
  abstract extractRows(pageHtml: string): string[];
  abstract extractSummary(rowHtml: string): MusicSummary;
  abstract extractDetailUrl(rowHtml: string): string;
  abstract extractDetail(detailHtml: string): MusicDetail;
}
