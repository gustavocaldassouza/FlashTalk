using FlashTalk.Domain;

namespace FlashTalk.Presentation
{
  public interface IJwtUtils
  {
    public string GenerateJwtToken(User user);
    public int? ValidateJwtToken(string? token);
  }

}