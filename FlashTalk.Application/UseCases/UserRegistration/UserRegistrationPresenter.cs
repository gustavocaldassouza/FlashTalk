using FlashTalk.Domain;

namespace FlashTalk.Application.UseCases.UserRegistration
{
  public class UserRegistrationPresenter : IOutputPort
  {
    public User? User { get; private set; }
    public bool ErrorOutput { get; private set; }
    public void Error(string message)
    {
      ErrorOutput = true;
    }

    public void Ok(User user)
    {
      User = user;
    }
  }

}
