using System;
using System.Data;
using Microsoft.Data.SqlClient;
using Dapper;
using FlashTalk.Domain;
using Microsoft.Extensions.Configuration;

namespace FlashTalk.Infrastructure
{
  public class ChatRepository : IChatRepository
  {
    private readonly string _connectionString;

    public ChatRepository(IConfiguration configuration)
    {
      _connectionString = configuration.GetConnectionString("FlashTalkDb") ?? throw new ArgumentNullException("FLASH_TALK_CONNECTION_STRING");
    }

    public int GetChannelId(int senderId, int receiverId)
    {
      using (IDbConnection connection = new SqlConnection(_connectionString))
      {
        connection.Open();

        string query = @"SELECT CHAT_ID 
                           FROM (SELECT TWO_PART_CHATS.USER_ID
	 		                                , TWO_PART_CHATS.CHAT_ID
 		                               FROM (SELECT PART.USER_ID
  			 		                                  , PART.CHAT_ID
				                                   FROM PARTICIPANT PART
				                                  WHERE PART.CHAT_ID IN (SELECT CHAT_ID 
				 						                                               FROM participant 
                                                               GROUP BY CHAT_ID 
                                                                 HAVING COUNT(*) = 2)) AS TWO_PART_CHATS 
                                  WHERE TWO_PART_CHATS.USER_ID IN (@SenderId, @ReceiverId)) AS GROUPED_TWO_PART_CHATS 
                               GROUP BY CHAT_ID 
                                 HAVING COUNT(*) = 2;";
        var parameters = new { SenderId = senderId, ReceiverId = receiverId };

        return connection.QueryFirstOrDefault<int>(query, parameters);
      }
    }

    public int InsertNewChat(int senderId, int receiverId)
    {
      using (IDbConnection connection = new SqlConnection(_connectionString))
      {
        connection.Open();

        using (var transaction = connection.BeginTransaction())
        {
          try
          {
            string chatInsertQuery = @"INSERT INTO Chat (name, owner_id) OUTPUT INSERTED.id 
                                                    VALUES (@Name, @OwnerId);";
            var parametersChat = new { Name = "Default Name", OwnerId = senderId };
            int chatId = connection.ExecuteScalar<int>(chatInsertQuery, parametersChat, transaction: transaction);

            string participantInsertQuery = @"INSERT INTO Participant (chat_id, user_id) 
                                                            VALUES (@ChatId, @SenderId)
                                                                 , (@ChatId, @ReceiverId);";
            var parametersParticipant = new { ChatId = chatId, SenderId = senderId, ReceiverId = receiverId };
            connection.Execute(participantInsertQuery, parametersParticipant, transaction: transaction);

            transaction.Commit();

            return chatId;
          }
          catch (Exception)
          {
            transaction.Rollback();
            throw;
          }
        }
      }
    }

    public int InsertNewMessage(int channelId, string message, int senderId)
    {
      using (IDbConnection connection = new SqlConnection(_connectionString))
      {
        connection.Open();

        string query = @"INSERT INTO Message (chat_id, sender_id, text_message) OUTPUT INSERTED.id
                                      VALUES (@ChatId, @SenderId, @Message);";
        var parameters = new { ChatId = channelId, SenderId = senderId, Message = message };

        return connection.ExecuteScalar<int>(query, parameters);
      }
    }

    public int InsertNewDocument(int messageId, string filePath)
    {
      using (IDbConnection connection = new SqlConnection(_connectionString))
      {
        connection.Open();

        string query = @"INSERT INTO DOCUMENT (message_id, file_path) OUTPUT INSERTED.id
                                       VALUES (@MessageId, @FilePath);";
        var parameters = new { MessageId = messageId, FilePath = filePath };

        return connection.ExecuteScalar<int>(query, parameters);
      }
    }

    public IEnumerable<Chat> GetChatByUserId(int userId)
    {
      IEnumerable<Chat> chats = RetrieveChatByUserId(userId);
      foreach (var chat in chats)
      {
        chat.Messages = RetrieveMessages(chat.Id);
        foreach (var message in chat.Messages)
        {
          message.Documents = RetrieveDocuments(message.Id);
        }
        chat.Participants = RetrieveParticipants(chat.Id);
      }

      return chats;
    }

    public Chat GetChatById(int chatId)
    {
      Chat chat = RetrieveChatByChatId(chatId);
      IEnumerable<Message> messages = RetrieveMessages(chatId);
      IEnumerable<User> participants = RetrieveParticipants(chatId);

      if (chat != null)
      {
        foreach (var message in messages)
        {
          message.Documents = RetrieveDocuments(message.Id);
        }
        chat.Messages = messages;
        chat.Participants = participants;
        return chat;
      }

      return new Chat();
    }

    private IEnumerable<Chat> RetrieveChatByUserId(int userId)
    {
      using (IDbConnection connection = new SqlConnection(_connectionString))
      {
        connection.Open();
        string query = @"SELECT CHAT.ID CHAT_ID
                              , CHAT.NAME CHAT_NAME
                              , CHAT.CREATED_AT CHAT_CREATED_AT
                              , OWNER.ID OWNER_ID
                              , OWNER.NAME OWNER_NAME
                              , OWNER.EMAIL OWNER_EMAIL
                           FROM PARTICIPANT PART
                           JOIN CHAT ON CHAT.ID = PART.CHAT_ID
                           JOIN USERD OWNER ON CHAT.OWNER_ID = OWNER.ID
                          WHERE PART.USER_ID = @UserId;";
        var parameters = new { UserId = userId };

        var chat = connection.Query(query, parameters)
                     .Select(row => new Chat
                     {
                       Id = row.CHAT_ID,
                       Name = row.CHAT_NAME,
                       CreatedAt = row.CHAT_CREATED_AT,
                       Owner = new User
                       {
                         Id = row.OWNER_ID,
                         Name = row.OWNER_NAME,
                         Email = row.OWNER_EMAIL
                       }
                     }).ToList();

        return chat!;
      }
    }

    private Chat RetrieveChatByChatId(int chatId)
    {
      using (IDbConnection connection = new SqlConnection(_connectionString))
      {
        connection.Open();
        string query = @"SELECT CHAT.ID CHAT_ID
                              , CHAT.NAME CHAT_NAME
                              , CHAT.CREATED_AT CHAT_CREATED_AT
                              , OWNER.ID OWNER_ID
                              , OWNER.NAME OWNER_NAME
                              , OWNER.EMAIL OWNER_EMAIL
                           FROM CHAT
                           JOIN USERD OWNER ON CHAT.OWNER_ID = OWNER.ID
                          WHERE CHAT.ID = @ChatId;";
        var parameters = new { ChatId = chatId };

        var chat = connection.Query(query, parameters)
                     .Select(row => new Chat
                     {
                       Id = row.CHAT_ID,
                       Name = row.CHAT_NAME,
                       CreatedAt = row.CHAT_CREATED_AT,
                       Owner = new User
                       {
                         Id = row.OWNER_ID,
                         Name = row.OWNER_NAME,
                         Email = row.OWNER_EMAIL
                       }
                     }).FirstOrDefault();

        return chat!;
      }
    }

    private IEnumerable<Message> RetrieveMessages(int chatId)
    {
      using (IDbConnection connection = new SqlConnection(_connectionString))
      {
        connection.Open();

        string query = @"SELECT MESSAGE.ID MESSAGE_ID
                              , MESSAGE.CREATED_AT MESSAGE_CREATED_AT
                              , MESSAGE.TEXT_MESSAGE MESSAGE_TEXT
                              , MESSAGE.IS_READ MESSAGE_IS_READ
                              , SENDER.ID SENDER_ID
                              , SENDER.NAME SENDER_NAME
                              , SENDER.EMAIL SENDER_EMAIL
                           FROM CHAT
                           JOIN MESSAGE ON CHAT.ID = MESSAGE.CHAT_ID
                           JOIN PARTICIPANT PART ON PART.USER_ID = MESSAGE.SENDER_ID AND PART.CHAT_ID = CHAT.ID
                           JOIN USERD SENDER ON PART.USER_ID = SENDER.ID
                          WHERE CHAT.ID = @ChatId;";
        var parameters = new { ChatId = chatId };

        var messages = connection.Query(query, parameters)
                      .Select(row => new Message
                      {
                        Id = row.MESSAGE_ID,
                        CreatedAt = row.MESSAGE_CREATED_AT,
                        Text = row.MESSAGE_TEXT,
                        IsRead = row.MESSAGE_IS_READ,
                        Sender = new User
                        {
                          Id = row.SENDER_ID,
                          Name = row.SENDER_NAME,
                          Email = row.SENDER_EMAIL
                        }
                      }).ToList();

        return messages;
      }
    }

    private IEnumerable<Document> RetrieveDocuments(int messageId)
    {
      using (IDbConnection connection = new SqlConnection(_connectionString))
      {
        connection.Open();

        string query = @"SELECT ID, FILE_PATH, CREATED_AT FROM DOCUMENT WHERE MESSAGE_ID = @MessageId;";
        var parameters = new { MessageId = messageId };

        var documents = connection.Query(query, parameters)
                      .Select(row => new Document
                      {
                        Id = row.ID,
                        FilePath = row.FILE_PATH,
                        CreatedAt = row.CREATED_AT
                      }).ToList();

        SetFileName(documents);

        return documents;
      }
    }

    private void SetFileName(IEnumerable<Document> documents)
    {
      foreach (var document in documents)
      {
        if (document.FilePath != null)
        {
          document.FileName = Path.GetFileName(document.FilePath);
        }
      }
    }

    private IEnumerable<User> RetrieveParticipants(int chatId)
    {
      using (IDbConnection connection = new SqlConnection(_connectionString))
      {
        connection.Open();

        string query = @"SELECT USERD.ID USER_ID
                              , USERD.NAME USER_NAME
                              , USERD.EMAIL USER_EMAIL
                              , USERD.COLOR USER_COLOR
                           FROM PARTICIPANT PART
                           JOIN USERD USERD ON USERD.ID = PART.USER_ID
                          WHERE PART.CHAT_ID = @ChatId;";
        var parameters = new { ChatId = chatId };

        var participants = connection.Query(query, parameters)
                      .Select(row => new User
                      {
                        Id = row.USER_ID,
                        Name = row.USER_NAME,
                        Email = row.USER_EMAIL,
                        Color = row.USER_COLOR
                      }).ToList();

        return participants;
      }
    }

    public Chat ReadChat(int chatId, int userId)
    {
      using (IDbConnection connection = new SqlConnection(_connectionString))
      {
        connection.Open();

        string query = @"UPDATE MESSAGE
                            SET IS_READ = 1
                          WHERE CHAT_ID = @ChatId AND SENDER_ID != @UserId";
        var parameters = new { ChatId = chatId, UserId = userId };

        connection.Execute(query, parameters);

        return GetChatById(chatId);
      }
    }

    public FileStream? GetFileFromMessage(int messageId, string fileName)
    {
      using (IDbConnection connection = new SqlConnection(_connectionString))
      {
        connection.Open();

        string query = @"SELECT DOCUMENT.FILE_PATH
                           FROM DOCUMENT
                          WHERE DOCUMENT.MESSAGE_ID = @MessageId AND DOCUMENT.FILE_PATH LIKE @FileName;";
        var parameters = new { MessageId = messageId, FileName = $"%{fileName}" };

        string? filePath = connection.QueryFirstOrDefault<string>(query, parameters);

        if (filePath != null)
        {
          return new FileStream(filePath, FileMode.Open, FileAccess.Read);
        }

        return null;
      }
    }

    public bool UpdateMessage(int messageId, string newText, int senderId)
    {
      using (IDbConnection connection = new SqlConnection(_connectionString))
      {
        connection.Open();

        // First, check if the message exists and belongs to the sender
        string checkQuery = @"SELECT ID, SENDER_ID, CREATED_AT, TEXT_MESSAGE FROM MESSAGE WHERE ID = @MessageId;";
        var checkParams = new { MessageId = messageId };
        var message = connection.QueryFirstOrDefault<dynamic>(checkQuery, checkParams);

        if (message == null)
        {
          return false;
        }

        int msgSenderId = message.SENDER_ID;
        if (msgSenderId != senderId)
        {
          return false;
        }

        // Check if message was sent within the last 15 minutes (edit time limit)
        DateTime createdAt = message.CREATED_AT;
        if (DateTime.UtcNow.Subtract(createdAt).TotalMinutes > 15)
        {
          return false; // Edit time limit exceeded
        }

        // Save the original text to edit history
        string insertEditQuery = @"INSERT INTO MESSAGE_EDIT (message_id, original_text, edited_at) 
                                   VALUES (@MessageId, @OriginalText, @EditedAt);";
        string originalText = message.TEXT_MESSAGE;
        var editParams = new { MessageId = messageId, OriginalText = originalText, EditedAt = DateTime.UtcNow };
        connection.Execute(insertEditQuery, editParams);

        // Update the message text and set EditedAt timestamp
        string updateQuery = @"UPDATE MESSAGE 
                              SET TEXT_MESSAGE = @NewText, EDITED_AT = @EditedAt 
                              WHERE ID = @MessageId;";
        var updateParams = new { NewText = newText, EditedAt = DateTime.UtcNow, MessageId = messageId };
        int rowsAffected = connection.Execute(updateQuery, updateParams);

        return rowsAffected > 0;
      }
    }

    public bool DeleteMessage(int messageId, int senderId)
    {
      using (IDbConnection connection = new SqlConnection(_connectionString))
      {
        connection.Open();

        // First, check if the message exists and belongs to the sender
        string checkQuery = @"SELECT ID, SENDER_ID FROM MESSAGE WHERE ID = @MessageId;";
        var checkParams = new { MessageId = messageId };
        var message = connection.QueryFirstOrDefault<dynamic>(checkQuery, checkParams);

        if (message == null)
        {
          return false;
        }

        int msgSenderId = message.SENDER_ID;
        if (msgSenderId != senderId)
        {
          return false;
        }

        // Mark the message as deleted by clearing text and setting IsDeleted flag
        string deleteQuery = @"UPDATE MESSAGE 
                              SET IS_DELETED = 1, TEXT_MESSAGE = '[Deleted]' 
                              WHERE ID = @MessageId;";
        var deleteParams = new { MessageId = messageId };
        int rowsAffected = connection.Execute(deleteQuery, deleteParams);

        return rowsAffected > 0;
      }
    }

    public Message GetMessageById(int messageId)
    {
      using (IDbConnection connection = new SqlConnection(_connectionString))
      {
        connection.Open();

        string query = @"SELECT MESSAGE.ID MESSAGE_ID
                              , MESSAGE.CREATED_AT MESSAGE_CREATED_AT
                              , MESSAGE.TEXT_MESSAGE MESSAGE_TEXT
                              , MESSAGE.IS_READ MESSAGE_IS_READ
                              , MESSAGE.EDITED_AT MESSAGE_EDITED_AT
                              , MESSAGE.IS_DELETED MESSAGE_IS_DELETED
                              , SENDER.ID SENDER_ID
                              , SENDER.NAME SENDER_NAME
                              , SENDER.EMAIL SENDER_EMAIL
                           FROM MESSAGE
                           JOIN USERD SENDER ON MESSAGE.SENDER_ID = SENDER.ID
                          WHERE MESSAGE.ID = @MessageId;";
        var parameters = new { MessageId = messageId };

        var result = connection.QueryFirstOrDefault(query, parameters);

        if (result == null)
        {
          return new Message();
        }

        var message = new Message
        {
          Id = result.MESSAGE_ID,
          CreatedAt = result.MESSAGE_CREATED_AT,
          Text = result.MESSAGE_TEXT,
          IsRead = result.MESSAGE_IS_READ,
          EditedAt = result.MESSAGE_EDITED_AT,
          IsDeleted = result.MESSAGE_IS_DELETED,
          Sender = new User
          {
            Id = result.SENDER_ID,
            Name = result.SENDER_NAME,
            Email = result.SENDER_EMAIL
          }
        };

        // Retrieve edit history
        message.EditHistory = RetrieveMessageEditHistory(messageId);
        // Retrieve documents
        message.Documents = RetrieveDocuments(messageId);

        return message;
      }
    }

    public IEnumerable<MessageEdit> GetMessageEditHistory(int messageId)
    {
      return RetrieveMessageEditHistory(messageId);
    }

    private IEnumerable<MessageEdit> RetrieveMessageEditHistory(int messageId)
    {
      using (IDbConnection connection = new SqlConnection(_connectionString))
      {
        connection.Open();

        string query = @"SELECT ID, MESSAGE_ID, ORIGINAL_TEXT, EDITED_AT 
                       FROM MESSAGE_EDIT 
                       WHERE MESSAGE_ID = @MessageId 
                       ORDER BY EDITED_AT DESC;";
        var parameters = new { MessageId = messageId };

        var edits = connection.Query(query, parameters)
                      .Select(row => new MessageEdit
                      {
                        Id = row.ID,
                        MessageId = row.MESSAGE_ID,
                        OriginalText = row.ORIGINAL_TEXT,
                        EditedAt = row.EDITED_AT
                      }).ToList();

        return edits;
      }
    }

    public int InsertMessageEdit(int messageId, string originalText)
    {
      using (IDbConnection connection = new SqlConnection(_connectionString))
      {
        connection.Open();

        string query = @"INSERT INTO MESSAGE_EDIT (message_id, original_text, edited_at) 
                       OUTPUT INSERTED.id
                       VALUES (@MessageId, @OriginalText, @EditedAt);";
        var parameters = new { MessageId = messageId, OriginalText = originalText, EditedAt = DateTime.UtcNow };

        return connection.ExecuteScalar<int>(query, parameters);
      }
    }
  }
}
