using System;

namespace FlashTalk.Domain
{
    public interface IChatRepository
    {
        int InsertNewChat(int senderId, int receiverId);
        Chat InsertNewMessage(int channelId, string message);
        int GetChannelId(int senderId, int receiverId);
    }
}
