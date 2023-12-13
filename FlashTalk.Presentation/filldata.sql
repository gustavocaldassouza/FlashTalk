USE flashtalk;

DROP TABLE IF EXISTS [dbo].participant;
DROP TABLE IF EXISTS [dbo].message;
DROP TABLE IF EXISTS [dbo].chat;
DROP TABLE IF EXISTS [dbo].userd;

CREATE TABLE [dbo].userd
(
  id INT IDENTITY(1,1) PRIMARY KEY,
  name VARCHAR(30) NOT NULL,
  email VARCHAR(60) NOT NULL,
  password VARCHAR(30) NOT NULL,
  color VARCHAR(7) NOT NULL,
);

CREATE TABLE [dbo].chat
(
  id INT IDENTITY(1,1) PRIMARY KEY,
  name VARCHAR(30) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT GETDATE(),
  owner_id INT NOT NULL,
  FOREIGN KEY (owner_id) REFERENCES userd(id)
);

CREATE TABLE [dbo].message
(
  id INT IDENTITY(1,1) PRIMARY KEY,
  chat_id INT NOT NULL,
  sender_id INT NOT NULL,
  text_message VARCHAR(255) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT GETDATE(),
  is_read BIT NOT NULL DEFAULT 0,
  FOREIGN KEY (chat_id) REFERENCES chat(id),
  FOREIGN KEY (sender_id) REFERENCES userd(id)
);

CREATE TABLE [dbo].participant
(
  id INT IDENTITY(1,1) PRIMARY KEY,
  user_id INT NOT NULL,
  chat_id INT NOT NULL,
  FOREIGN KEY (chat_id) REFERENCES chat(id),
  FOREIGN KEY (user_id) REFERENCES userd(id)
);

INSERT INTO [dbo].userd (name, email, password, color) VALUES ('João', 'joao@email.com', '12345', '#3E4A89');
INSERT INTO [dbo].userd (name, email, password, color) VALUES ('Maria', 'maria@email.com', '12345', '#6FBC43');
INSERT INTO [dbo].userd (name, email, password, color) VALUES ('José', 'jose@email.com', '12345', '#D81159');
INSERT INTO [dbo].userd (name, email, password, color) VALUES ('Ana', 'ana@email.com', '12345', '#F2C641');
INSERT INTO [dbo].userd (name, email, password, color) VALUES ('Pedro', 'pedro@email.com', '12345', '#1D8EAB');
INSERT INTO [dbo].userd (name, email, password, color) VALUES ('Paulo', 'paulo@email.com', '12345', '#9C27B0');

INSERT INTO [dbo].chat (name, owner_id, created_at) VALUES ('Chat 1', 1, GETDATE() - 1);
INSERT INTO [dbo].chat (name, owner_id) VALUES ('Chat 2', 2);
INSERT INTO [dbo].chat (name, owner_id) VALUES ('Chat 3', 3);

INSERT INTO [dbo].message (chat_id, sender_id, text_message) VALUES (1, 1, 'Olá 1');
INSERT INTO [dbo].message (chat_id, sender_id, text_message) VALUES (1, 2, 'Olá 2');

INSERT INTO [dbo].message (chat_id, sender_id, text_message) VALUES (2, 1, 'Olá 3');
INSERT INTO [dbo].message (chat_id, sender_id, text_message) VALUES (2, 3, 'Olá 4');

INSERT INTO [dbo].message (chat_id, sender_id, text_message) VALUES (3, 2, 'Olá 5');
INSERT INTO [dbo].message (chat_id, sender_id, text_message) VALUES (3, 3, 'Olá 6');

INSERT INTO [dbo].participant (user_id, chat_id) VALUES (1, 1);
INSERT INTO [dbo].participant (user_id, chat_id) VALUES (2, 1);

INSERT INTO [dbo].participant (user_id, chat_id) VALUES (1, 2);
INSERT INTO [dbo].participant (user_id, chat_id) VALUES (3, 2);

INSERT INTO [dbo].participant (user_id, chat_id) VALUES (2, 3);
INSERT INTO [dbo].participant (user_id, chat_id) VALUES (3, 3);