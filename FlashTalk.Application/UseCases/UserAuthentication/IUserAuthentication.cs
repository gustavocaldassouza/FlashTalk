namespace FlashTalk.Application.UseCases.UserAuthentication
{
  public interface IUserAuthentication
  {
    void Execute(string email, string password);
    void SetOutputPort(IOutputPort outputPort);
  }
}
