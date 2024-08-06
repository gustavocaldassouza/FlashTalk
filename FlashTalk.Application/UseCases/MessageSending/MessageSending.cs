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
        int chatId = _chatRepository.GetChannelId(senderId, receiverId);
        if (chatId == 0)
        {
          chatId = _chatRepository.InsertNewChat(senderId, receiverId);
        }
        _chatRepository.InsertNewMessage(chatId, message, senderId);

        var chat = _chatRepository.GetChatById(chatId);
        _outputPort.Ok(chat);
      }
      catch (Exception e)
      {
        _outputPort.Error(e.Message);
      }
    }

    public void Execute(int senderId, int receiverId, string message, IEnumerable<string> filePaths)
    {
      try
      {
        int chatId = _chatRepository.GetChannelId(senderId, receiverId);
        if (chatId == 0)
        {
          chatId = _chatRepository.InsertNewChat(senderId, receiverId);
        }
        int messageId = _chatRepository.InsertNewMessage(chatId, message, senderId);
        foreach (var filePath in filePaths)
        {
          if (filePath != null)
          {
            _chatRepository.InsertNewDocument(messageId, filePath);
          }
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
