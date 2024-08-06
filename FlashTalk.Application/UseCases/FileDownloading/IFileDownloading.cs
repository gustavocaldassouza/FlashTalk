namespace FlashTalk.Application.UseCases.FileDownloading;

public interface IFileDownloading
{
  void Execute(int messageId, string fileName);
  void SetOutputPort(IOutputPort outputPort);
}
