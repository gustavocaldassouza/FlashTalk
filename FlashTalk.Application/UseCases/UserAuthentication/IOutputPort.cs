using FlashTalk.Domain;

namespace FlashTalk.Application.UseCases.UserAuthentication
{
  public interface IOutputPort
  {
    void Error(string message);
    void Ok(User user);
  }
}
