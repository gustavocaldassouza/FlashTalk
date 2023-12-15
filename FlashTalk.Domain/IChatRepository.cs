using System;

namespace FlashTalk.Domain
{
  public interface IChatRepository
  {
    int InsertNewChat(int senderId, int receiverId);
    void InsertNewMessage(int channelId, string message, int senderId);
    int GetChannelId(int senderId, int receiverId);
    Chat GetChatById(int chatId);
    IEnumerable<Chat> GetChatByUserId(int userId);
    Chat ReadChat(int chatId, int userId);
  }
}
