export default class CrawledWeb {
  id: number;
  url: string;
  title: string;
  crawlTime: string;
  executionId: number;
  state: string;

  public constructor(
    id: number,
    url: string,
    title: string,
    crawlTime: string,
    executionId: number,
    state: string
  ) {
    this.id = id;
    this.url = url;
    this.title = title;
    this.crawlTime = crawlTime;
    this.executionId = executionId;
    this.state = state;
  }
}
