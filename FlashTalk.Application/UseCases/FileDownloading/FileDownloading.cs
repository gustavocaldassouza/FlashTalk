using FlashTalk.Domain;

namespace FlashTalk.Application.UseCases.FileDownloading;

public class FileDownloading : IFileDownloading
{
  private IOutputPort _outputPort;
  private readonly IChatRepository _chatRepository;
  public FileDownloading(IChatRepository chatRepository)
  {
    _chatRepository = chatRepository;
    _outputPort = new FileDownloadingPresenter();
  }
  public void Execute(int chatId, string fileName)
  {
    try
    {
      var file = _chatRepository.GetFileFromChat(chatId, fileName);
      _outputPort.Ok(file!);
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
