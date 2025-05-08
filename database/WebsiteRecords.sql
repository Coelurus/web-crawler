START TRANSACTION;

CREATE TABLE WebsiteRecords
(
    id            serial PRIMARY KEY,
    label         varchar(255) NOT NULL,
    url           varchar(255) NOT NULL,
    regex         varchar(255) NOT NULL,
    time_id       int          NOT NULL,
    active        boolean      NOT NULL,
    result_record int
);

ALTER TABLE WebsiteRecords
    ADD CONSTRAINT fk_result_record
        FOREIGN KEY (result_record)
            REFERENCES crawlresults (id)
            ON DELETE SET NULL;

INSERT INTO WebsiteRecords (id, label, url, regex, time_id, active)
VALUES (0, 'task',
        'https://webik.ms.mff.cuni.cz/nswi153/seminar-project-webcrawler.html',
        ',*cs.*CRUD.*', 0, TRUE);

SELECT setval(pg_get_serial_sequence('WebsiteRecords', 'id'),
              (SELECT MAX(id) FROM WebsiteRecords) + 1);

COMMIT;
