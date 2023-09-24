-- Your SQL goes here
CREATE TABLE logstreams (
  id SERIAL PRIMARY KEY,
  logs VARCHAR NOT NULL,
  timeStored BIGINT NOT NULL,
  displayed BOOLEAN NOT NULL DEFAULT 'f'
)