using System.Data;
using System.Data.SqlClient;
using Dapper;
using FlashTalk.Domain;
using Microsoft.Extensions.Configuration;

namespace FlashTalk.Infrastructure
{
  public class UserRepository : IUserRepository
  {
    private readonly string _connectionString;

    public UserRepository(IConfiguration configuration)
    {
      _connectionString = configuration.GetConnectionString("FlashTalkDb") ?? throw new ArgumentNullException("FLASH_TALK_CONNECTION_STRING");
    }

    public User GetUserByEmail(string email)
    {
      using (IDbConnection connection = new SqlConnection(_connectionString))
      {
        connection.Open();

        string query = "SELECT id, name, email FROM userd WHERE email = @Email";
        var parameters = new { Email = email };

        return connection.QueryFirst<User>(query, parameters);
      }
    }

    public User GetUserInfo(int userId)
    {
      using (IDbConnection connection = new SqlConnection(_connectionString))
      {
        connection.Open();

        string query = "SELECT id, name, email FROM userd WHERE id = @Id";
        var parameters = new { Id = userId };

        return connection.QueryFirst<User>(query, parameters);
      }
    }

    public IEnumerable<User> GetUsersByName(string name)
    {
      using (IDbConnection connection = new SqlConnection(_connectionString))
      {
        connection.Open();

        string query = "SELECT id, name, email FROM userd WHERE name LIKE @Name";
        var parameters = new { Name = $"%{name}%" };

        return connection.Query<User>(query, parameters);
      }
    }

    public bool IsEmailTaken(string email)
    {
      using (IDbConnection connection = new SqlConnection(_connectionString))
      {
        connection.Open();

        string query = "SELECT COUNT(*) FROM userd WHERE email = @Email";
        var parameters = new { Email = email };

        int count = connection.ExecuteScalar<int>(query, parameters);

        return count > 0;
      }
    }

    public User Register(string name, string email, string password)
    {
      int id = 0;
      using (IDbConnection connection = new SqlConnection(_connectionString))
      {
        connection.Open();

        string query = "INSERT INTO userd (name, email, password) OUTPUT INSERTED.id VALUES (@Name, @Email, @Password)";
        var parameters = new { Name = name, Email = email, Password = password };

        id = connection.ExecuteScalar<int>(query, parameters);
      }

      User user = GetById(id);
      return user;
    }

    private User GetById(int id)
    {
      using (SqlConnection connection = new SqlConnection(_connectionString))
      {
        connection.Open();

        string query = "SELECT id, name, email FROM userd WHERE id = @Id";
        var parameters = new { Id = id };

        return connection.QueryFirst<User>(query, parameters);
      }
    }
  }
}
