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
            int id = 0;
            using (IDbConnection connection = new SqlConnection(_connectionString))
            {
                connection.Open();

                string query = "INSERT INTO chat (sender_id, receiver_id) OUTPUT INSERTED.id VALUES (@SenderId, @ReceiverId)";
                var parameters = new { SenderId = senderId, ReceiverId = receiverId };

                id = connection.ExecuteScalar<int>(query, parameters);
            }

            return id;
        }

        public Chat InsertNewMessage(int channelId, string message)
        {
            throw new NotImplementedException();
        }

    }
}
