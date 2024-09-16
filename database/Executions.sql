START TRANSACTION;

CREATE TABLE Executions (
  id serial PRIMARY KEY,
  wr_id int NOT NULL,
  status varchar(255) NOT NULL,
  start_time varchar(255) NOT NULL,
  end_time varchar(255) NOT NULL,
  crawled_count int NOT NULL
);

COMMIT;