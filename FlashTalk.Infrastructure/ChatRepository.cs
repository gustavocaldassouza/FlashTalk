using System;
using System.Data;
using System.Data.SqlClient;
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

    public void InsertNewMessage(int channelId, string message, int senderId)
    {
      using (IDbConnection connection = new SqlConnection(_connectionString))
      {
        connection.Open();

        string query = @"INSERT INTO Message (chat_id, sender_id, text_message) OUTPUT INSERTED.id
                                      VALUES (@ChatId, @SenderId, @Message);";
        var parameters = new { ChatId = channelId, SenderId = senderId, Message = message };

        connection.Execute(query, parameters);
      }
    }

    public Chat GetChatById(int chatId)
    {
      Chat chat = RetrieveChat(chatId);
      IEnumerable<Message> messages = RetrieveMessages(chatId);
      IEnumerable<User> participants = RetrieveParticipants(chatId);

      if (chat != null)
      {
        chat.Messages = messages;
        chat.Participants = participants;
        return chat;
      }

      return new Chat();
    }

    private Chat RetrieveChat(int chatId)
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

    private IEnumerable<User> RetrieveParticipants(int chatId)
    {
      using (IDbConnection connection = new SqlConnection(_connectionString))
      {
        connection.Open();

        string query = @"SELECT USERD.ID USER_ID
                              , USERD.NAME USER_NAME
                              , USERD.EMAIL USER_EMAIL
                           FROM PARTICIPANT PART
                           JOIN USERD USERD ON USERD.ID = PART.USER_ID
                          WHERE PART.CHAT_ID = @ChatId;";
        var parameters = new { ChatId = chatId };

        var participants = connection.Query(query, parameters)
                      .Select(row => new User
                      {
                        Id = row.USER_ID,
                        Name = row.USER_NAME,
                        Email = row.USER_EMAIL
                      }).ToList();

        return participants;
      }
    }

    public IEnumerable<Chat> GetChatsByUserId(int userId)
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
                           JOIN PARTICIPANT PART ON PART.CHAT_ID = CHAT.ID
                          WHERE PART.USER_ID = @UserId;";
        var parameters = new { UserId = userId };

        var chats = connection.Query(query, parameters)
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

        return chats;
      }
    }
  }
}
