START TRANSACTION;

CREATE TABLE CrawlLinks (
  parent_id int NOT NULL,
  son_id NOT NULL
);

COMMIT;