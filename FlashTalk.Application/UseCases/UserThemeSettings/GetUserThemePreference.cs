using FlashTalk.Domain;

namespace FlashTalk.Application.UseCases.UserThemeSettings
{
    public class GetUserThemePreference : IGetUserThemePreference
    {
        private readonly IUserThemeRepository _repository;
        private readonly IGetUserThemePreferenceOutputPort _outputPort;

        public GetUserThemePreference(
          IUserThemeRepository repository,
          IGetUserThemePreferenceOutputPort outputPort)
        {
            _repository = repository;
            _outputPort = outputPort;
        }

        public async Task Execute(int userId)
        {
            if (userId <= 0)
            {
                _outputPort.Error("Invalid user ID");
                return;
            }

            try
            {
                var preference = await _repository.GetThemePreferenceAsync(userId);

                if (preference == null)
                {
                    // Return default preferences if none exist
                    preference = new UserThemePreference(userId, "light", "medium");
                    _outputPort.Success(preference);
                    return;
                }

                _outputPort.Success(preference);
            }
            catch (Exception ex)
            {
                _outputPort.Error($"Failed to retrieve theme preference: {ex.Message}");
            }
        }
    }
}
