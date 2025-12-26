using System;

namespace FlashTalk.Domain
{
    public class UserThemePreference
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string ThemeMode { get; set; } = "light"; // "light" or "dark"
        public string FontSizeScale { get; set; } = "medium"; // "small", "medium", "large"
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        public UserThemePreference()
        {
            CreatedAt = DateTime.UtcNow;
            UpdatedAt = DateTime.UtcNow;
        }

        public UserThemePreference(int userId, string themeMode = "light", string fontSizeScale = "medium")
        {
            UserId = userId;
            ThemeMode = themeMode;
            FontSizeScale = fontSizeScale;
            CreatedAt = DateTime.UtcNow;
            UpdatedAt = DateTime.UtcNow;
        }
    }
}
