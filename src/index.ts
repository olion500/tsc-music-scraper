import MelonScraper from '@/melon.scraper';

const scraper = new MelonScraper();
scraper.get().then(music => console.log(music));
