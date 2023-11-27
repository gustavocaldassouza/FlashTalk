using FlashTalk.Domain;

namespace FlashTalk.Application.UseCases.UserRegistration
{
  public class UserRegistrationPresenter : IOutputPort
  {
    public User? User { get; private set; }
    public bool ErrorOutput { get; private set; }
    public string? ErrorMessage { get; private set; }
    public void Error(string message)
    {
      ErrorOutput = true;
      ErrorMessage = message;
    }

    public void Ok(User user)
    {
      User = user;
    }
  }

}
