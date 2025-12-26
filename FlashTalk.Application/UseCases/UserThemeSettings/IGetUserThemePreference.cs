using FlashTalk.Domain;

namespace FlashTalk.Application.UseCases.UserThemeSettings
{
    public interface IGetUserThemePreference
    {
        Task Execute(int userId);
    }
}
