using System;

namespace FlashTalk.Domain
{
    public class MessageEdit
    {
        public int Id { get; set; }
        public int MessageId { get; set; }
        public string OriginalText { get; set; }
        public DateTime EditedAt { get; set; }

        public MessageEdit(int id, int messageId, string originalText, DateTime editedAt)
        {
            Id = id;
            MessageId = messageId;
            OriginalText = originalText;
            EditedAt = editedAt;
        }

        public MessageEdit(int messageId, string originalText, DateTime editedAt)
        {
            MessageId = messageId;
            OriginalText = originalText;
            EditedAt = editedAt;
        }

        public MessageEdit()
        {
            OriginalText = string.Empty;
        }
    }
}
