using System;
using FlashTalk.Domain;

namespace FlashTalk.Application.UseCases.MessageEditing
{
    public class MessageEditing : IMessageEditing
    {
        private IOutputPort _outputPort;
        private readonly IChatRepository _chatRepository;

        public MessageEditing(IChatRepository chatRepository)
        {
            _outputPort = new MessageEditingPresenter();
            _chatRepository = chatRepository;
        }

        public void Execute(int messageId, string newText, int userId)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(newText))
                {
                    _outputPort.Error("Message text cannot be empty");
                    return;
                }

                bool updated = _chatRepository.UpdateMessage(messageId, newText, userId);

                if (!updated)
                {
                    _outputPort.Error("Failed to update message. Check permissions or edit time limit (15 minutes).");
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
