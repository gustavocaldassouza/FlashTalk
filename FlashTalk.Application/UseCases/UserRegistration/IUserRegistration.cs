namespace FlashTalk.Application.UseCases.UserRegistration
{
  public interface IUserRegistration
  {
    void Execute(string name, string email, string password);
    void SetOutputPort(IOutputPort outputPort);
  }
}
