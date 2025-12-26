using FlashTalk.Domain;

namespace FlashTalk.Application.UseCases.UserThemeSettings
{
    public interface IUpdateUserThemePreference
    {
        Task Execute(UserThemePreference preference);
    }
}
