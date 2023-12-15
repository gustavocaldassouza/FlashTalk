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

    public void Execute(int senderId, int receiverId, string message, string filePath)
    {
      try
      {
        int chatId = _chatRepository.GetChannelId(senderId, receiverId);
        if (chatId == 0)
        {
          chatId = _chatRepository.InsertNewChat(senderId, receiverId);
        }
        if (filePath == string.Empty)
        {
          _chatRepository.InsertNewMessage(chatId, message, senderId);
        }
        else
        {
          _chatRepository.InsertNewMessageWithFile(chatId, message, senderId, filePath);
        }
        var chat = _chatRepository.GetChatById(chatId);
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
