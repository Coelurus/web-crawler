START TRANSACTION;

CREATE TABLE WebsiteRecords (
  id serial PRIMARY KEY,
  url varchar(255) NOT NULL,
  regex varchar(255),
  day smallint NOT NULL,
  hour smallint NOT NULL,
  minute smallint NOT NULL,
  label varchar(255) NOT NULL,
  active boolean NOT NULL
);

INSERT INTO WebsiteRecords (id, url, regex, day, hour, minute, label, active) VALUES
(0, 'https://webik.ms.mff.cuni.cz/nswi153/seminar-project-webcrawler.html', '.*', 0, 0, 1, 'task', TRUE);

SELECT setval(pg_get_serial_sequence('WebsiteRecords', 'id'), (SELECT MAX(id) FROM WebsiteRecords) + 1);

COMMIT;
