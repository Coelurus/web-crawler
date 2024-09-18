START TRANSACTION;

CREATE TABLE PeriodicityTimes (
  id bigserial PRIMARY KEY,
  minute integer NOT NULL,
  hour integer NOT NULL,
  day integer NOT NULL
);

INSERT INTO PeriodicityTimes (id, minute, hour, day) VALUES
(0, 20, 1, 0),
(1, 0, 0, 1);

SELECT setval(pg_get_serial_sequence('PeriodicityTimes', 'id'), (SELECT MAX(id) FROM PeriodicityTimes) + 1);

COMMIT;