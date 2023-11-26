using FlashTalk.Domain;

namespace FlashTalk.Application.UseCases.UserRegistration
{
  public interface IOutputPort
  {
    void Error(string message);
    void Ok(User user);
  }
}
