using FlashTalk.Domain;

namespace FlashTalk.Presentation
{
    public class JwtMiddleware
    {
        private readonly RequestDelegate _next;

        public JwtMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context, IUserRepository userRepository, IJwtUtils jwtUtils)
        {
            var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();
            var userId = jwtUtils.ValidateJwtToken(token);
            if (userId != null)
            {
                // attach user to context on successful jwt validation
                var user = userRepository.GetUserInfo(userId.Value);
                context.Items["User"] = user;
                
                // Set up the user principal for authorization
                var claims = new[]
                {
                    new System.Security.Claims.Claim("id", userId.Value.ToString())
                };
                var identity = new System.Security.Claims.ClaimsIdentity(claims, "jwt");
                context.User = new System.Security.Claims.ClaimsPrincipal(identity);
            }

            await _next(context);
        }
    }
}
