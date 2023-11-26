using System;
using FlashTalk.Application.UseCases.UserRegistration;
using FlashTalk.Domain;
using FlashTalk.Infrastructure;

namespace FlashTalk.Presentation
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddUseCases(this IServiceCollection services)
        {
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IUserRegistration, UserRegistration>();
            return services;
        }
    }
}
