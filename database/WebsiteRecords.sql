START TRANSACTION;

CREATE TABLE WebsiteRecords
(
    id            bigserial PRIMARY KEY,
    label         varchar(255) NOT NULL,
    url           varchar(255) NOT NULL,
    regex         varchar(255) NOT NULL,
    time_id       bigint       NOT NULL,
    active        boolean      NOT NULL,
    result_record bigint
);

ALTER TABLE WebsiteRecords
    ADD CONSTRAINT fk_result_record
        FOREIGN KEY (result_record)
            REFERENCES crawlresults (id)
            ON DELETE SET NULL;

INSERT INTO WebsiteRecords (id, label, url, regex, time_id, active)
VALUES (0, 'task',
        'https://webik.ms.mff.cuni.cz/nswi153/seminar-project/',
        '.*webik.*', 0, FALSE);

SELECT setval(pg_get_serial_sequence('WebsiteRecords', 'id'),
              (SELECT MAX(id) FROM WebsiteRecords) + 1);

COMMIT;
