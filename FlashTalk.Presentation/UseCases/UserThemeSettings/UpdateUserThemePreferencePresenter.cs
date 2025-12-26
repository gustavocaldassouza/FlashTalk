using FlashTalk.Application.UseCases.UserThemeSettings;
using FlashTalk.Domain;

namespace FlashTalk.Presentation.UseCases.UserThemeSettings
{
    public class UpdateUserThemePreferencePresenter : IUpdateUserThemePreferenceOutputPort
    {
        public UserThemePreference? Result { get; set; }
        public string? ErrorMessage { get; set; }

        public void Success(UserThemePreference preference)
        {
            Result = preference;
            ErrorMessage = null;
        }

        public void ValidationError(string message)
        {
            Result = null;
            ErrorMessage = message;
        }

        public void Error(string message)
        {
            Result = null;
            ErrorMessage = message;
        }
    }
}
