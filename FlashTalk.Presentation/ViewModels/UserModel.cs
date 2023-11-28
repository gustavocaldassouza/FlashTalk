using System;
using System.ComponentModel.DataAnnotations;
using FlashTalk.Domain;

namespace FlashTalk.Presentation.ViewModels
{
  public class UserModel
  {
    public int Id { get; set; }
    [Required][MinLength(5)][MaxLength(30)] public string? Name { get; set; }
    [Required][MinLength(20)][MaxLength(60)][EmailAddress] public string? Email { get; set; }
    [Required][MinLength(5)][MaxLength(30)] public string? Password { get; set; }
    public UserModel()
    {

    }
  }
}
