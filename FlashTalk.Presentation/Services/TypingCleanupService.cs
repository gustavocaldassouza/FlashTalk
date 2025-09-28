using Microsoft.AspNetCore.SignalR;
using FlashTalk.Presentation.Hubs;

namespace FlashTalk.Presentation.Services
{
    public class TypingCleanupService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<TypingCleanupService> _logger;

        public TypingCleanupService(IServiceProvider serviceProvider, ILogger<TypingCleanupService> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    using var scope = _serviceProvider.CreateScope();
                    var presenceService = scope.ServiceProvider.GetRequiredService<IPresenceService>();
                    
                    await presenceService.CleanupExpiredTypingAsync();
                    
                    // Clean up every 5 seconds
                    await Task.Delay(TimeSpan.FromSeconds(5), stoppingToken);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error occurred while cleaning up expired typing indicators");
                    await Task.Delay(TimeSpan.FromSeconds(10), stoppingToken);
                }
            }
        }
    }
}