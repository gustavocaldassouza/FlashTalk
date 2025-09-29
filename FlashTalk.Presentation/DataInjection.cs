using System.Data.SqlClient;
using Dapper;

namespace FlashTalk.Presentation
{
  public static class DataInjection
  {
    public static void HandleDatabase(IConfiguration configuration)
    {
      var createConnectionString = configuration.GetConnectionString("FlashTalkDbCreate") ?? throw new ArgumentNullException("FLASH_TALK_CONNECTION_STRING");
      var dbConnectionString = configuration.GetConnectionString("FlashTalkDb") ?? throw new ArgumentNullException("FLASH_TALK_CONNECTION_STRING");
      var createScriptPath = Path.Combine(AppContext.BaseDirectory, "createdata.sql");
      var fillScriptPath = Path.Combine(AppContext.BaseDirectory, "filldata.sql");

      int i = 0;
      while (i < 5)
      {
        try
        {
          // First, try to create the database (ignore if it already exists)
          try
          {
            using (var connection = new SqlConnection(createConnectionString))
            {
              var createScript = File.ReadAllText(createScriptPath);
              connection.Execute(createScript);
            }
            Console.WriteLine("Database created successfully!");
          }
          catch (Exception ex)
          {
            if (ex.Message.Contains("already exists"))
            {
              Console.WriteLine("Database already exists, continuing...");
            }
            else
            {
              throw;
            }
          }

          // Then, connect to the database and create tables + insert data
          using (var connection = new SqlConnection(dbConnectionString))
          {
            var fillScript = File.ReadAllText(fillScriptPath);
            connection.Execute(fillScript);
          }
          
          Console.WriteLine("Database tables created and populated successfully!");
          break;
        }
        catch (Exception ex)
        {
          i++;
          Console.WriteLine($"Database setup attempt {i} failed: {ex.Message}");
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