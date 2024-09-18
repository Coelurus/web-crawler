START TRANSACTION;

CREATE TABLE CrawlLinks (
  parent_id bigint NOT NULL,
  son_id bigint NOT NULL
);

COMMIT;