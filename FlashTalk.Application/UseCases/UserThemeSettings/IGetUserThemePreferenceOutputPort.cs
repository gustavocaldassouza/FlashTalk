using FlashTalk.Domain;

namespace FlashTalk.Application.UseCases.UserThemeSettings
{
    public interface IGetUserThemePreferenceOutputPort
    {
        void Success(UserThemePreference preference);
        void NotFound();
        void Error(string message);
    }
}
