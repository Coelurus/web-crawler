START TRANSACTION;

CREATE TABLE Executions
(
    id            bigserial PRIMARY KEY,
    wr_id         bigint       NOT NULL,
    status        varchar(255) NOT NULL,
    start_time    TIMESTAMPTZ  NOT NULL,
    end_time      TIMESTAMPTZ,
    crawled_count int          NOT NULL
);

SELECT setval(pg_get_serial_sequence('Executions', 'id'), (SELECT MAX(id) FROM Executions) + 1);

COMMIT;