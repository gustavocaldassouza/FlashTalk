using System;
using FlashTalk.Domain;

namespace FlashTalk.Application.UseCases.MessageSending
{
    public class MessageSending : IMessageSending
    {
        private IOutputPort _outputPort;
        private readonly IChatRepository _chatRepository;
        public MessageSending(IChatRepository chatRepository)
        {
            _outputPort = new IMessageSendingPresenter();
            _chatRepository = chatRepository;
        }

        public void Execute(int senderId, int receiverId, string message)
        {
            try
            {
                int channelId = _chatRepository.GetChannelId(senderId, receiverId);
                if (channelId == 0)
                {
                    channelId = _chatRepository.InsertNewChat(senderId, receiverId);
                }
                var chat = _chatRepository.InsertNewMessage(channelId, message);
                _outputPort.Ok(chat);
            }
            catch (Exception e)
            {
                _outputPort.Error(e.Message);
            }
        }

        public void SetOutputPort(IOutputPort outputPort)
        {
            _outputPort = outputPort;
        }

    }
}
