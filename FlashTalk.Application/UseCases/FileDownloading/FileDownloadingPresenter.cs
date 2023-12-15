namespace FlashTalk.Application.UseCases.FileDownloading;

public class FileDownloadingPresenter : IOutputPort
{
  public FileStream? File { get; private set; }
  public bool ErrorOutput { get; private set; }
  public string? ErrorMessage { get; private set; }
  public void Error(string message)
  {
    ErrorOutput = true;
    ErrorMessage = message;
  }

  public void Ok(FileStream file)
  {
    File = file;
  }
}
