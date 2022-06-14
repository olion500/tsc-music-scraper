export type MusicSummary = {
  ranking: number; // 음원 순위
  name: string; // 곡 이름
  singer: string; // 가수 이름
  album: string; // 앨범 이름
};

export type MusicDetail = {
  publisher: string; // 발매사
  agency: string; // 기획사
};

export type MusicInfo = MusicSummary & MusicDetail;
