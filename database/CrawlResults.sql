START TRANSACTION;

CREATE TABLE CrawlResults (
  id bigserial PRIMARY KEY,
  url varchar(255) NOT NULL,
  title varchar(255) NOT NULL,
  crawl_time varchar(255) NOT NULL
);

COMMIT;