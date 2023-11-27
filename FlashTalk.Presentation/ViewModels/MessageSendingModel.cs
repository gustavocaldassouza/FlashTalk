using System.ComponentModel.DataAnnotations;
using FlashTalk.Domain;

namespace FlashTalk.Presentation.ViewModels
{
  public class MessageSendingModel
  {
    [Required] public string? Message { get; set; }
    [Required] public int SenderId { get; set; }
    [Required] public int ReceiverId { get; set; }

    public MessageSendingModel()
    {

    }
  }

}
