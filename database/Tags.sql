START TRANSACTION;

CREATE TABLE Tags (
  id serial PRIMARY KEY,
  name varchar(255) NOT NULL,
  wr_id bigint NOT NULL
);

INSERT INTO Tags (id, name, wr_id) VALUES
(0, 'TAG1', 0),
(1, 'TAG222', 0);


SELECT setval(pg_get_serial_sequence('Tags', 'id'), 1, false);


COMMIT;