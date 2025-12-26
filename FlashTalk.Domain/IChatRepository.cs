using System;

namespace FlashTalk.Domain
{
  public interface IChatRepository
  {
    int InsertNewChat(int senderId, int receiverId);
    int InsertNewMessage(int channelId, string message, int senderId);
    int InsertNewDocument(int messageId, string filePath);
    int GetChannelId(int senderId, int receiverId);
    Chat GetChatById(int chatId);
    IEnumerable<Chat> GetChatByUserId(int userId);
    Chat ReadChat(int chatId, int userId);
    FileStream? GetFileFromMessage(int messageId, string fileName);
    bool UpdateMessage(int messageId, string newText, int senderId);
    bool DeleteMessage(int messageId, int senderId);
    Message GetMessageById(int messageId);
    IEnumerable<MessageEdit> GetMessageEditHistory(int messageId);
    int InsertMessageEdit(int messageId, string originalText);
  }
}
