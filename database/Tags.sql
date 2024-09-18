START TRANSACTION;

CREATE TABLE Tags (
  id bigserial PRIMARY KEY,
  name varchar(255) NOT NULL,
  wr_id bigint NOT NULL
);

INSERT INTO Tags (id, name, wr_id) VALUES
(0, 'Uni', 0),
(1, 'Work', 0);

SELECT setval(pg_get_serial_sequence('Tags', 'id'), (SELECT MAX(id) FROM Tags) + 1);

COMMIT;