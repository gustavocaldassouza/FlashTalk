using System;

namespace FlashTalk.Domain
{
  public class Document
  {
    public int Id { get; set; }
    public string? FilePath { get; set; }
    public string? FileName { get; set; }
    public DateTime CreatedAt { get; set; }

    public Document(int id, string? filePath, string? fileName, DateTime createdAt)
    {
      Id = id;
      FilePath = filePath;
      FileName = fileName;
      CreatedAt = createdAt;
    }

    public Document(string? filePath, string? fileName)
    {
      FilePath = filePath;
      FileName = fileName;
      CreatedAt = DateTime.Now;
    }

    public Document()
    {

    }
  }
}
