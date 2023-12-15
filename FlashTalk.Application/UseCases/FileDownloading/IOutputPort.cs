namespace FlashTalk.Application.UseCases.FileDownloading;

public interface IOutputPort
{
  void Ok(FileStream file);
  void Error(string message);
}
