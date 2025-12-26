using FlashTalk.Domain;

namespace FlashTalk.Application.UseCases.UserThemeSettings
{
    public class UpdateUserThemePreference : IUpdateUserThemePreference
    {
        private readonly IUserThemeRepository _repository;
        private readonly IUpdateUserThemePreferenceOutputPort _outputPort;

        public UpdateUserThemePreference(
          IUserThemeRepository repository,
          IUpdateUserThemePreferenceOutputPort outputPort)
        {
            _repository = repository;
            _outputPort = outputPort;
        }

        public async Task Execute(UserThemePreference preference)
        {
            if (preference == null)
            {
                _outputPort.ValidationError("Theme preference cannot be null");
                return;
            }

            if (preference.UserId <= 0)
            {
                _outputPort.ValidationError("Invalid user ID");
                return;
            }

            // Validate theme mode
            var validThemeModes = new[] { "light", "dark" };
            if (!validThemeModes.Contains(preference.ThemeMode?.ToLower()))
            {
                _outputPort.ValidationError("Theme mode must be 'light' or 'dark'");
                return;
            }

            // Validate font size scale
            var validFontSizes = new[] { "small", "medium", "large" };
            if (!validFontSizes.Contains(preference.FontSizeScale?.ToLower()))
            {
                _outputPort.ValidationError("Font size scale must be 'small', 'medium', or 'large'");
                return;
            }

            try
            {
                preference.UpdatedAt = DateTime.UtcNow;
                var success = await _repository.CreateOrUpdateThemePreferenceAsync(preference);

                if (success)
                {
                    _outputPort.Success(preference);
                }
                else
                {
                    _outputPort.Error("Failed to update theme preference");
                }
            }
            catch (Exception ex)
            {
                _outputPort.Error($"Failed to update theme preference: {ex.Message}");
            }
        }
    }
}
