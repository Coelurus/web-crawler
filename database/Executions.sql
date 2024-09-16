START TRANSACTION;

CREATE TABLE Executions (
  id serial PRIMARY KEY,
  wr_id int NOT NULL,
  status varchar(255) NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  crawled_count int NOT NULL
);

COMMIT;