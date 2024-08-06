using System;
using System.ComponentModel.DataAnnotations;

namespace FlashTalk.Presentation.ViewModels
{
  public class FileUpload
  {
    [Required] public IEnumerable<IFormFile>? Files { get; set; }
    [Required] public int ReceiverId { get; set; }
    public string? Message { get; set; }
    public FileUpload()
    {

    }
  }
}
