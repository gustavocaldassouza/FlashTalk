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
  password VARCHAR(30) NOT NULL
);

INSERT INTO [dbo].userd (name, email, password) VALUES ('João', 'joao@email.com', '123');
INSERT INTO [dbo].userd (name, email, password) VALUES ('Maria', 'maria@email.com', '123');
INSERT INTO [dbo].userd (name, email, password) VALUES ('José', 'jose@email.com', '123');

CREATE TABLE [dbo].chat
(
  id INT IDENTITY(1,1) PRIMARY KEY,
  name VARCHAR(30) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT GETDATE(),
  owner_id INT NOT NULL,
  FOREIGN KEY (owner_id) REFERENCES userd(id)
);

INSERT INTO [dbo].chat (name, owner_id) VALUES ('Chat 1', 1);
INSERT INTO [dbo].chat (name, owner_id) VALUES ('Chat 2', 2);
INSERT INTO [dbo].chat (name, owner_id) VALUES ('Chat 3', 3);
INSERT INTO [dbo].chat (name, owner_id) VALUES ('Chat 4', 3);
INSERT INTO [dbo].chat (name, owner_id) VALUES ('Chat 5', 3);

CREATE TABLE [dbo].message
(
  id INT IDENTITY(1,1) PRIMARY KEY,
  chat_id INT NOT NULL,
  sender_id INT NOT NULL,
  text_message VARCHAR(255) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT GETDATE(),
  FOREIGN KEY (chat_id) REFERENCES chat(id),
  FOREIGN KEY (sender_id) REFERENCES userd(id)
);

INSERT INTO [dbo].message (chat_id, sender_id, text_message) VALUES (1, 1, 'Olá 1');
INSERT INTO [dbo].message (chat_id, sender_id, text_message) VALUES (1, 2, 'Olá 2');
INSERT INTO [dbo].message (chat_id, sender_id, text_message) VALUES (1, 3, 'Olá 3');
INSERT INTO [dbo].message (chat_id, sender_id, text_message) VALUES (2, 1, 'Olá 4');
INSERT INTO [dbo].message (chat_id, sender_id, text_message) VALUES (2, 2, 'Olá 5');
INSERT INTO [dbo].message (chat_id, sender_id, text_message) VALUES (2, 3, 'Olá 6');
INSERT INTO [dbo].message (chat_id, sender_id, text_message) VALUES (3, 1, 'Olá 7');
INSERT INTO [dbo].message (chat_id, sender_id, text_message) VALUES (3, 2, 'Olá 8');
INSERT INTO [dbo].message (chat_id, sender_id, text_message) VALUES (3, 3, 'Olá 9');
INSERT INTO [dbo].message (chat_id, sender_id, text_message) VALUES (4, 2, 'Olá 10');
INSERT INTO [dbo].message (chat_id, sender_id, text_message) VALUES (4, 3, 'Olá 11');
INSERT INTO [dbo].message (chat_id, sender_id, text_message) VALUES (5, 1, 'Olá 12');
INSERT INTO [dbo].message (chat_id, sender_id, text_message) VALUES (5, 3, 'Olá 13');

CREATE TABLE [dbo].participant
(
  id INT IDENTITY(1,1) PRIMARY KEY,
  user_id INT NOT NULL,
  chat_id INT NOT NULL,
  FOREIGN KEY (chat_id) REFERENCES chat(id),
  FOREIGN KEY (user_id) REFERENCES userd(id)
);

INSERT INTO [dbo].participant (user_id, chat_id) VALUES (1, 1);
INSERT INTO [dbo].participant (user_id, chat_id) VALUES (2, 1);
INSERT INTO [dbo].participant (user_id, chat_id) VALUES (3, 1);
INSERT INTO [dbo].participant (user_id, chat_id) VALUES (1, 2);
INSERT INTO [dbo].participant (user_id, chat_id) VALUES (2, 2);
INSERT INTO [dbo].participant (user_id, chat_id) VALUES (3, 2);
INSERT INTO [dbo].participant (user_id, chat_id) VALUES (1, 3);
INSERT INTO [dbo].participant (user_id, chat_id) VALUES (2, 3);
INSERT INTO [dbo].participant (user_id, chat_id) VALUES (3, 3);
INSERT INTO [dbo].participant (user_id, chat_id) VALUES (2, 4);
INSERT INTO [dbo].participant (user_id, chat_id) VALUES (3, 4);
INSERT INTO [dbo].participant (user_id, chat_id) VALUES (1, 5);
INSERT INTO [dbo].participant (user_id, chat_id) VALUES (3, 5);