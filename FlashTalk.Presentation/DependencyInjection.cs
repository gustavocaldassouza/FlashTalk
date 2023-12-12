using FlashTalk.Application.UseCases.MessageReceiving;
using FlashTalk.Application.UseCases.MessageSending;
using FlashTalk.Application.UseCases.UserAuthentication;
using FlashTalk.Application.UseCases.UserInfo;
using FlashTalk.Application.UseCases.UserRegistration;
using FlashTalk.Application.UseCases.UserSearch;
using FlashTalk.Domain;
using FlashTalk.Infrastructure;

namespace FlashTalk.Presentation
{
  public static class DependencyInjection
  {
    public static IServiceCollection AddUseCases(this IServiceCollection services)
    {
      services.AddScoped<IUserRepository, UserRepository>();
      services.AddScoped<IChatRepository, ChatRepository>();

      services.AddScoped<IUserRegistration, UserRegistration>();
      services.AddScoped<IUserAuthentication, UserAuthentication>();
      services.AddScoped<IUserSearch, UserSearch>();
      services.AddScoped<IUserInfo, UserInfo>();
      services.AddScoped<IMessageSending, MessageSending>();
      services.AddScoped<IMessageReceiving, MessageReceiving>();

      return services;
    }
  }
}
