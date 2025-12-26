using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using FlashTalk.Application.UseCases.UserThemeSettings;
using FlashTalk.Domain;
using FlashTalk.Presentation.UseCases.UserThemeSettings;

namespace FlashTalk.Presentation.UseCases.UserThemeSettings
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UserThemeSettingsController : ControllerBase
    {
        private readonly IGetUserThemePreference _getThemePreference;
        private readonly IUpdateUserThemePreference _updateThemePreference;
        private readonly IGetUserThemePreferenceOutputPort _getPresenter;
        private readonly IUpdateUserThemePreferenceOutputPort _updatePresenter;

        public UserThemeSettingsController(
          IGetUserThemePreference getThemePreference,
          IUpdateUserThemePreference updateThemePreference,
          IGetUserThemePreferenceOutputPort getPresenter,
          IUpdateUserThemePreferenceOutputPort updatePresenter)
        {
            _getThemePreference = getThemePreference;
            _updateThemePreference = updateThemePreference;
            _getPresenter = getPresenter;
            _updatePresenter = updatePresenter;
        }

        [HttpGet("{userId}")]
        public async Task<IActionResult> GetThemePreference(int userId)
        {
            // Ensure user is only accessing their own preferences
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdClaim, out var authenticatedUserId) || authenticatedUserId != userId)
            {
                return Unauthorized("You can only access your own theme preferences");
            }

            await _getThemePreference.Execute(userId);

            var presenter = _getPresenter as GetUserThemePreferencePresenter;
            if (presenter?.ErrorMessage != null)
            {
                return BadRequest(new { error = presenter.ErrorMessage });
            }

            return Ok(presenter?.Result);
        }

        [HttpPut("{userId}")]
        public async Task<IActionResult> UpdateThemePreference(int userId, [FromBody] UpdateThemePreferenceRequest request)
        {
            // Ensure user is only updating their own preferences
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdClaim, out var authenticatedUserId) || authenticatedUserId != userId)
            {
                return Unauthorized("You can only update your own theme preferences");
            }

            var preference = new UserThemePreference(userId, request.ThemeMode, request.FontSizeScale);

            await _updateThemePreference.Execute(preference);

            var presenter = _updatePresenter as UpdateUserThemePreferencePresenter;
            if (presenter?.ErrorMessage != null)
            {
                return BadRequest(new { error = presenter.ErrorMessage });
            }

            return Ok(presenter?.Result);
        }
    }

    public class UpdateThemePreferenceRequest
    {
        public string ThemeMode { get; set; } = "light";
        public string FontSizeScale { get; set; } = "medium";
    }
}
