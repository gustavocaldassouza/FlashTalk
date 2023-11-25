"""
Web Messaging Application

This application allows users to send and receive messages in real-time through a web interface.

Requirements:

- User Registration: Users should be able to create an account and log in to the application.
- Message Sending: Users should be able to compose and send messages to other users.
- Message Receiving: Users should be able to receive and view messages sent to them.
- Real-time Updates: The application should provide real-time updates for new messages.
- User Search: Users should be able to search for other users to send messages to.
- Message History: Users should be able to view their message history with other users.
- Notifications: Users should receive notifications for new messages.

Use Cases:

1. User Registration:

- User enters their name, email, and password.
- User clicks on the "Register" button.
- System validates the input and creates a new user account.

2. Message Sending:

- User selects a recipient from their contacts list.
- User composes a message in the message input field.
- User clicks on the "Send" button.
- System sends the message to the recipient.

3. Message Receiving:

- User logs in to the application.
- System retrieves new messages for the user.
- User views the received messages in their message inbox.

4. Real-time Updates:
   WebHooks?

- System establishes a WebSocket connection with the client.
- System listens for new messages from the server.
- System pushes new messages to the client in real-time.

5. User Search:

- User enters a search query in the search input field.
- User clicks on the "Search" button.
- System retrieves a list of users matching the search query.

6. Message History:

- User selects a contact from their contacts list.
- System retrieves the message history between the user and the contact.
- User views the message history in the chat interface.

7. Notifications:

- System sends a push notification to the user's device for new messages.
- User receives the notification and can click on it to open the application.

8. Message Filtering:
   User applies filters to their message inbox (e.g., by sender, date, or keyword).
   System retrieves and displays only the messages that match the applied filters.
9. Message Deletion:
   User selects one or more messages from their message inbox.
   User clicks on the "Delete" button.
   System removes the selected messages from the user's inbox.
10. Message Editing:
    User selects a message from their message history.
    User clicks on the "Edit" button.
    User modifies the content of the message.
    User clicks on the "Save" button.
    System updates the message content and notifies the recipient.
11. Message Forwarding:
    User selects a message from their message history.
    User clicks on the "Forward" button.
    User selects one or more recipients to forward the message to.
    User clicks on the "Send" button.
    System sends a copy of the message to the selected recipients.
12. Group Messaging:
    User creates a new group and adds members to it.
    User composes a message in the group chat interface.
    User clicks on the "Send" button.
    System sends the message to all members of the group.
