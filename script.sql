IF NOT EXISTS (SELECT name
FROM sys.databases
WHERE name = 'flashtalk')
BEGIN
  CREATE DATABASE flashtalk;
END

USE flashtalk;
DROP TABLE IF EXISTS [dbo].userd;

create table [dbo].userd
(
  id int identity(1,1) primary key,
  name varchar(30) not null,
  email varchar(60) not null,
  password varchar(30) not null
);