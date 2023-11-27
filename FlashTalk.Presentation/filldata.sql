USE flashtalk;

DROP TABLE IF EXISTS [dbo].userd;

CREATE TABLE [dbo].userd
(
  id INT IDENTITY(1,1) PRIMARY KEY,
  name VARCHAR(30) NOT NULL,
  email VARCHAR(60) NOT NULL,
  password VARCHAR(30) NOT NULL
);