namespace FlashTalk.Application.UseCases.FileDownloading;

public interface IFileDownloading
{
  void Execute(int chatId, string fileName);
  void SetOutputPort(IOutputPort outputPort);
}
