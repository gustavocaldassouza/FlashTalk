using FlashTalk.Domain;
using Microsoft.Data.SqlClient;
using Dapper;
using Microsoft.Extensions.Configuration;

namespace FlashTalk.Infrastructure
{
    public class UserThemeRepository : IUserThemeRepository
    {
        private readonly string _connectionString;

        public UserThemeRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("FlashTalkDb") ?? throw new ArgumentNullException("FLASH_TALK_CONNECTION_STRING");
        }

        public async Task<UserThemePreference?> GetThemePreferenceAsync(int userId)
        {
            try
            {
                using (var connection = new SqlConnection(_connectionString))
                {
                    await connection.OpenAsync();
                    const string query = @"
            SELECT 
              id, 
              user_id, 
              theme_mode, 
              font_size_scale, 
              created_at, 
              updated_at
            FROM user_theme_preference
            WHERE user_id = @UserId";

                    var preference = await connection.QueryFirstOrDefaultAsync<UserThemePreference>(
                      query,
                      new { UserId = userId });

                    return preference;
                }
            }
            catch (Exception)
            {
                return null;
            }
        }

        public async Task<bool> CreateOrUpdateThemePreferenceAsync(UserThemePreference preference)
        {
            try
            {
                using (var connection = new SqlConnection(_connectionString))
                {
                    await connection.OpenAsync();

                    // Check if preference exists
                    const string checkQuery = "SELECT COUNT(*) FROM user_theme_preference WHERE user_id = @UserId";
                    var result = await connection.ExecuteScalarAsync(checkQuery, new { UserId = preference.UserId });
                    var exists = (result != null && (int)result > 0);

                    if (exists)
                    {
                        // Update existing preference
                        const string updateQuery = @"
              UPDATE user_theme_preference
              SET theme_mode = @ThemeMode,
                  font_size_scale = @FontSizeScale,
                  updated_at = @UpdatedAt
              WHERE user_id = @UserId";

                        var rowsAffected = await connection.ExecuteAsync(updateQuery, new
                        {
                            ThemeMode = preference.ThemeMode,
                            FontSizeScale = preference.FontSizeScale,
                            UpdatedAt = preference.UpdatedAt,
                            UserId = preference.UserId
                        });

                        return rowsAffected > 0;
                    }
                    else
                    {
                        // Insert new preference
                        const string insertQuery = @"
              INSERT INTO user_theme_preference (user_id, theme_mode, font_size_scale, created_at, updated_at)
              VALUES (@UserId, @ThemeMode, @FontSizeScale, @CreatedAt, @UpdatedAt)";

                        var rowsAffected = await connection.ExecuteAsync(insertQuery, new
                        {
                            UserId = preference.UserId,
                            ThemeMode = preference.ThemeMode,
                            FontSizeScale = preference.FontSizeScale,
                            CreatedAt = preference.CreatedAt,
                            UpdatedAt = preference.UpdatedAt
                        });

                        return rowsAffected > 0;
                    }
                }
            }
            catch (Exception)
            {
                return false;
            }
        }

        public async Task<bool> DeleteThemePreferenceAsync(int userId)
        {
            try
            {
                using (var connection = new SqlConnection(_connectionString))
                {
                    await connection.OpenAsync();
                    const string query = "DELETE FROM user_theme_preference WHERE user_id = @UserId";

                    var rowsAffected = await connection.ExecuteAsync(query, new { UserId = userId });
                    return rowsAffected > 0;
                }
            }
            catch (Exception)
            {
                return false;
            }
        }
    }
}
