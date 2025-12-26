using System;
using FlashTalk.Domain;

namespace FlashTalk.Application.UseCases.MessageDeleting
{
    public class MessageDeleting : IMessageDeleting
    {
        private IOutputPort _outputPort;
        private readonly IChatRepository _chatRepository;

        public MessageDeleting(IChatRepository chatRepository)
        {
            _outputPort = new MessageDeletingPresenter();
            _chatRepository = chatRepository;
        }

        public void Execute(int messageId, int userId)
        {
            try
            {
                bool deleted = _chatRepository.DeleteMessage(messageId, userId);

                if (!deleted)
                {
                    _outputPort.Error("Failed to delete message. Check permissions or message ownership.");
                    return;
                }

                Message message = _chatRepository.GetMessageById(messageId);
                _outputPort.Ok(message);
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
