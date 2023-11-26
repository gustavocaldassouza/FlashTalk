using System;
using FlashTalk.Domain;

namespace FlashTalk.Application.UseCases.UserRegistration
{
    public class UserRegistration : IUserRegistration
    {
        private readonly IUserRepository _userRepository;
        private IOutputPort _outputPort;
        public UserRegistration(IUserRepository userRepository)
        {
            _outputPort = new UserRegistrationPresenter();
            _userRepository = userRepository;
        }
        public void Execute(string name, string email, string password)
        {
            try
            {
                var user = _userRepository.Register(name, email, password);
                _outputPort.Ok(user);
            }
            catch (Exception ex)
            {
                _outputPort.Error(ex.Message);
            }
        }

        public void SetOutputPort(IOutputPort outputPort)
        {
            _outputPort = outputPort;
        }
    }
}
