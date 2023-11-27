using System;
using FlashTalk.Application.UseCases.UserSearch;
using FlashTalk.Domain;
using Microsoft.AspNetCore.Mvc;

namespace FlashTalk.Presentation.UseCases.UserSearch
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserSearchController : ControllerBase, IOutputPort
    {
        private IActionResult? _viewModel;
        private readonly IUserSearch _userSearch;
        public UserSearchController(IUserSearch userSearch)
        {
            _userSearch = userSearch;
            _userSearch.SetOutputPort(this);
        }
        void IOutputPort.Error(string message)
        {
            _viewModel = BadRequest(message);
        }

        void IOutputPort.Ok(IEnumerable<User> users)
        {
            _viewModel = Ok(users);
        }

        [HttpGet]
        public IActionResult Get([FromQuery] string name)
        {
            _userSearch.Execute(name);
            return _viewModel!;
        }
    }
}
