# StratoStruct Frontend

Welcome to the StratoStruct frontend repository! StratoStruct is a full-stack web application built using the MERN (MongoDB, Express.js, React, Node.js) stack, designed to provide a platform for managing and analyzing structural data. This README provides an overview of the frontend component.

## Features

- User-friendly interface for visualising and interacting with construction supply chain data.
- Authentication and authorisation flow for secure access to user-specific data.
- Real-time updates for immediate data synchronisation.
- Responsive design for seamless usage across different devices.
- Intuitive navigation and user experience.

## Prerequisites

Before setting up the frontend, ensure that you have the following prerequisites installed:

- Node.js (v14 or later)
- npm (Node Package Manager)

## Getting Started

To get the frontend up and running, follow these steps:

1. Clone the repository:
   ```
   git clone https://github.com/HOOLAHAN/stratostruct_client.git
   ```

2. Navigate to the project directory:
   ```
   cd stratostruct_client
   ```

3. Install the dependencies:
   ```
   npm install
   ```

4. Configure backend server URL:
   - Open the `src/utils/api.js` file.
   - Set the `baseURL` variable to the URL of your backend server.

5. Start the frontend:
   ```
   npm start
   ```

6. The frontend application should now be running at `http://localhost:3000`.

## Project Structure

The project follows a modular structure for better organisation and maintainability. Here's an overview of the key directories and files:

- `src/`
  - `components/`: Reusable UI components used throughout the application.
  - `context/`: Context providers for managing application state.
  - `functions/`: Utility functions used across the application.
  - `hooks/`: Custom React hooks for shared logic and state management.
  - `pages/`: Top-level page components representing different views of the application.
- `App.js`: Entry point for the application, sets up routes and global configurations.
- `index.js`: Renders the root component and initializes the application.

Thank you for your interest in the StratoStruct frontend. If you have any questions or need further assistance, please don't hesitate to reach out.
