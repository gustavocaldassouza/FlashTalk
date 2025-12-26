using FlashTalk.Domain;

namespace FlashTalk.Domain
{
    public interface IUserThemeRepository
    {
        Task<UserThemePreference?> GetThemePreferenceAsync(int userId);
        Task<bool> CreateOrUpdateThemePreferenceAsync(UserThemePreference preference);
        Task<bool> DeleteThemePreferenceAsync(int userId);
    }
}
