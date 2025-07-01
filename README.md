# Apexbroker Project

## Overview

This project is a web application with an admin panel and user interface, featuring real-time chat functionality between users and admin. The chat supports unread message indicators, responsive design, and message history.

## Features

- **Admin Messages Page**
  - Responsive chat layout with a sidebar listing users who sent messages.
  - Sidebar is always visible on large screens and toggleable on small screens.
  - Messages section adjusts width based on sidebar visibility.
  
- **User Chat Toggle**
  - Real-time chat with admin using WebSocket (Socket.io).
  - Unread message indicator dot shown when chat is closed and unread messages exist.
  - Notification sound plays only on receiving messages from others.
  - Chat messages update immediately on sending and receiving.
  - Refresh button to manually refresh chat messages.
  - Automatic refresh of chat messages every 8 seconds when chat is open.

## Technologies Used

- Node.js with Express.js for backend.
- Socket.io for real-time WebSocket communication.
- EJS templating engine for server-side rendering.
- Vanilla JavaScript for client-side interactivity.
- CSS for responsive and styled UI.

## File Structure

- `views/admin/messages.ejs`: Admin chat page with responsive sidebar and messages section.
- `views/user/partials/footer.ejs`: User chat toggle component with real-time messaging and unread indicator.
- `socket.js`: WebSocket server setup handling message sending, receiving, and user connection management.
- Other controllers, models, and routes supporting user and admin functionalities.

## Setup and Running

1. Install dependencies:
   ```
   npm install
   ```

2. Start the server:
   ```
   npm start
   ```

3. Access the application via browser:
   - Admin panel: `/admin/messages`
   - User interface: as per routing setup.

## Notes

- Ensure the WebSocket server is running and accessible for real-time chat.
- The chat refresh interval is set to 8 seconds; this can be adjusted in `footer.ejs`.
- Unread message state is persisted in `localStorage` on the client side.

## Testing

- Verify responsive behavior of the admin messages page on different screen sizes.
- Test real-time chat message sending and receiving between user and admin.
- Confirm unread indicator dot appears and disappears correctly.
- Test refresh button and automatic refresh functionality in user chat toggle.

## Contact

For issues or contributions, please contact the project maintainer.
