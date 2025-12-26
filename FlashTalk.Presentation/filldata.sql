USE flashtalk;

DROP TABLE IF EXISTS [dbo].participant;
DROP TABLE IF EXISTS [dbo].document;
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
  text_message VARCHAR(255) NULL,
  created_at DATETIME NOT NULL DEFAULT GETDATE(),
  is_read BIT NOT NULL DEFAULT 0,
  edited_at DATETIME NULL,
  is_deleted BIT NOT NULL DEFAULT 0,
  FOREIGN KEY (chat_id) REFERENCES chat(id),
  FOREIGN KEY (sender_id) REFERENCES userd(id)
);

CREATE TABLE [dbo].document (
  id INT IDENTITY(1,1) PRIMARY KEY,
  message_id INT NOT NULL,
  file_path VARCHAR(255) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT GETDATE(),
  FOREIGN KEY (message_id) REFERENCES message(id)
);

CREATE TABLE [dbo].message_edit (
  id INT IDENTITY(1,1) PRIMARY KEY,
  message_id INT NOT NULL,
  original_text NVARCHAR(MAX) NOT NULL,
  edited_at DATETIME NOT NULL DEFAULT GETUTCDATE(),
  FOREIGN KEY (message_id) REFERENCES message(id) ON DELETE CASCADE
);

CREATE TABLE [dbo].participant
(
  id INT IDENTITY(1,1) PRIMARY KEY,
  user_id INT NOT NULL,
  chat_id INT NOT NULL,
  FOREIGN KEY (chat_id) REFERENCES chat(id),
  FOREIGN KEY (user_id) REFERENCES userd(id)
);

CREATE TABLE [dbo].user_theme_preference
(
  id INT IDENTITY(1,1) PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  theme_mode VARCHAR(20) NOT NULL DEFAULT 'light',
  font_size_scale VARCHAR(20) NOT NULL DEFAULT 'medium',
  created_at DATETIME NOT NULL DEFAULT GETDATE(),
  updated_at DATETIME NOT NULL DEFAULT GETDATE(),
  FOREIGN KEY (user_id) REFERENCES userd(id) ON DELETE CASCADE
);

INSERT INTO [dbo].userd (name, email, password, color) VALUES ('João', 'joaodasilva@email.com', '12345', '#3E4A89');
INSERT INTO [dbo].userd (name, email, password, color) VALUES ('Maria', 'mariadasilva@email.com', '12345', '#6FBC43');
INSERT INTO [dbo].userd (name, email, password, color) VALUES ('José', 'josedasilva@email.com', '12345', '#D81159');
INSERT INTO [dbo].userd (name, email, password, color) VALUES ('Ana', 'anadasilva@email.com', '12345', '#F2C641');
INSERT INTO [dbo].userd (name, email, password, color) VALUES ('Pedro', 'pedrodasilva@email.com', '12345', '#1D8EAB');
INSERT INTO [dbo].userd (name, email, password, color) VALUES ('Paulo', 'paulodasilva@email.com', '12345', '#9C27B0');

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

-- Insert default theme preferences for all users
INSERT INTO [dbo].user_theme_preference (user_id, theme_mode, font_size_scale) VALUES (1, 'light', 'medium');
INSERT INTO [dbo].user_theme_preference (user_id, theme_mode, font_size_scale) VALUES (2, 'dark', 'medium');
INSERT INTO [dbo].user_theme_preference (user_id, theme_mode, font_size_scale) VALUES (3, 'light', 'large');
INSERT INTO [dbo].user_theme_preference (user_id, theme_mode, font_size_scale) VALUES (4, 'dark', 'small');
INSERT INTO [dbo].user_theme_preference (user_id, theme_mode, font_size_scale) VALUES (5, 'light', 'medium');
INSERT INTO [dbo].user_theme_preference (user_id, theme_mode, font_size_scale) VALUES (6, 'dark', 'medium');
