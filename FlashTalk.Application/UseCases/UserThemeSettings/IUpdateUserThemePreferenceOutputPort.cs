using FlashTalk.Domain;

namespace FlashTalk.Application.UseCases.UserThemeSettings
{
    public interface IUpdateUserThemePreferenceOutputPort
    {
        void Success(UserThemePreference preference);
        void ValidationError(string message);
        void Error(string message);
    }
}
