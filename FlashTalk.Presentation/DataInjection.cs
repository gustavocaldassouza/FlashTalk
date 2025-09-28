using System.Data.SqlClient;
using Dapper;

namespace FlashTalk.Presentation
{
  public static class DataInjection
  {
    public static void HandleDatabase(IConfiguration configuration)
    {
      var connectionString = configuration.GetConnectionString("FlashTalkDbCreate") ?? throw new ArgumentNullException("FLASH_TALK_CONNECTION_STRING");
      var scriptPath = Path.Combine(AppContext.BaseDirectory, "createdata.sql");

      int i = 0;
      while (i < 5)
      {
        try
        {
          using (var connection = new SqlConnection(connectionString))
          {
            var script = File.ReadAllText(scriptPath);
            connection.Execute(script);
          }
          FillDatabase(configuration);
          break;
        }
        catch (Exception ex)
        {
          i++;
          Console.WriteLine(ex.Message);
          Thread.Sleep(10000);
        }
      }
    }

    public static void FillDatabase(IConfiguration configuration)
    {
      var connectionString = configuration.GetConnectionString("FlashTalkDb") ?? throw new ArgumentNullException("FLASH_TALK_CONNECTION_STRING");
      var scriptPath = Path.Combine(AppContext.BaseDirectory, "filldata.sql");

      using (var connection = new SqlConnection(connectionString))
      {
        var script = File.ReadAllText(scriptPath);
        connection.Execute(script);
      }
    }
  }
}