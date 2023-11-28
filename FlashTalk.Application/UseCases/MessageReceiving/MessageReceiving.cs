using System;
using FlashTalk.Domain;

namespace FlashTalk.Application.UseCases.MessageReceiving
{
    public class MessageReceiving : IMessageReceiving
    {
        private readonly IChatRepository _chatRepository;
        private IOutputPort _outputPort;
        public MessageReceiving(IChatRepository chatRepository)
        {
            _chatRepository = chatRepository;
            _outputPort = new MessageReceivingPresenter();
        }
        public void Execute(int userId)
        {
            try
            {
                var chats = _chatRepository.GetChatsByUserId(userId);
                _outputPort.Ok(chats);
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
