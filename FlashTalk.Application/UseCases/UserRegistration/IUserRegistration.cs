namespace FlashTalk.Application.UseCases.UserRegistration
{
  public interface IUserRegistration
  {
    void Execute(string name, string email, string password, string color);
    void SetOutputPort(IOutputPort outputPort);
  }
}
