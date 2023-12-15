using FlashTalk.Application.UseCases.FileDownloading;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FlashTalk.Presentation;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class FileDownloadingController : ControllerBase, IOutputPort
{
  private IActionResult? _viewModel;
  private readonly IFileDownloading _fileDownloading;
  public FileDownloadingController(IFileDownloading fileDownloading)
  {
    _fileDownloading = fileDownloading;
    fileDownloading.SetOutputPort(this);
  }
  void IOutputPort.Error(string message)
  {
    _viewModel = BadRequest(message);
  }

  void IOutputPort.Ok(FileStream file)
  {
    _viewModel = Ok(file);
  }

  [HttpGet("{chatId}/files/{fileName}")]
  public IActionResult DownloadFile(int chatId, string fileName)
  {
    _fileDownloading.Execute(chatId, fileName);
    return _viewModel!;
  }
}
