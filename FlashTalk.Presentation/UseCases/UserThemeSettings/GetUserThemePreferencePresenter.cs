using FlashTalk.Application.UseCases.UserThemeSettings;
using FlashTalk.Domain;

namespace FlashTalk.Presentation.UseCases.UserThemeSettings
{
    public class GetUserThemePreferencePresenter : IGetUserThemePreferenceOutputPort
    {
        public UserThemePreference? Result { get; set; }
        public string? ErrorMessage { get; set; }

        public void Success(UserThemePreference preference)
        {
            Result = preference;
            ErrorMessage = null;
        }

        public void NotFound()
        {
            Result = null;
            ErrorMessage = "Theme preference not found";
        }

        public void Error(string message)
        {
            Result = null;
            ErrorMessage = message;
        }
    }
}
