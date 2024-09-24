START TRANSACTION;

CREATE TABLE CrawlLinks
(
    id           bigserial PRIMARY KEY,
    from_id      bigint NOT NULL,
    to_id        bigint NOT NULL,
    execution_id bigint NOT NULL
);

COMMIT;