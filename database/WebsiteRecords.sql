START TRANSACTION;

CREATE TABLE WebsiteRecords (
  id bigint PRIMARY KEY,
  url varchar(255) NOT NULL,
  regex varchar(255),
  periodicity varchar(255) NOT NULL,
  label varchar(255) NOT NULL,
  active boolean NOT NULL
);

INSERT INTO WebsiteRecords (id, url, regex, periodicity, label, active) VALUES
(0, 'https://webik.ms.mff.cuni.cz/nswi153/seminar-project-webcrawler.html', '.*', '', 'task', TRUE);


SELECT setval(pg_get_serial_sequence('WebsiteRecords', 'id'), 1, false);


COMMIT;
