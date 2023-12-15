using System;
using FlashTalk.Application.UseCases.MessageReceiving;
using FlashTalk.Domain;

namespace FlashTalk.Application.UseCases.MessageReading
{
  public class MessageReading : IMessageReading
  {
    private readonly IChatRepository _chatRepository;
    private IOutputPort _outputPort;
    public MessageReading(IChatRepository chatRepository)
    {
      _chatRepository = chatRepository;
      _outputPort = new MessageReadingPresenter();
    }
    public void Execute(int chatId, int userId)
    {
      try
      {
        Chat chat = _chatRepository.ReadChat(chatId, userId);
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
