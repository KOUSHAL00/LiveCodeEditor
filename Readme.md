# liveCodeShare

A real-time, interactive, and collaborative code-sharing environment built for developers. This application lets multiple programmers seamlessly write and edit code together simultaneously within dynamically generated rooms.

## ✨ Features

*   **Real-Time Collaboration**: Edit the same code concurrently directly with your team without any latency, powered by the robust [Yjs](https://yjs.dev/) framework.
*   **Monaco Editor Integration**: Employs the industry-standard Monaco Editor engine (the core of VS Code) for highly reliable syntax highlighting, intelligent indentation, and rich text-editing features.
*   **Dynamic Rooms**: Instantly spin up isolated collaboration rooms. Every room features a dynamically generated UUID (e.g., `/room/xyz123`) guaranteeing privacy and easy session management.
*   **User Identity & Presence**: 
    *   Simple, frictionless username-based authentication required to join.
    *   Live visibility into exactly who is actively viewing the file with the "Online Users" top-bar visual indicator.
    *   Cursor multi-tracking: Automatically displays the names and customizable color avatars of remote contributors right over their interactive cursors.
*   **1-Click Sharing**: Embedded "Share Room" functionality that immediately copies the room link to your system clipboard for instant sharing.

## 🚀 Tech Stack

### Frontend
*   [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
*   [React Router](https://reactrouter.com/) for dynamic client-side routing
*   [Monaco Editor](https://microsoft.github.io/monaco-editor/) (`@monaco-editor/react`)
*   [Tailwind CSS](https://tailwindcss.com/) for rapid styling
*   [Lucide React](https://lucide.dev/) for crisp, scalable iconography
*   `y-monaco` + `y-websocket` (Yjs) for conflict-free replicated data types (CRDTs).

### Backend
*   [Node.js](https://nodejs.org/)
*   [Express](https://expressjs.com/) 
*   `ws` WebSockets server for lightweight bidirectional persistent connections.

## 🛠️ Getting Started

### Prerequisites
Make sure you have Node.js and `npm` installed.

### 1. Start the Backend Server
```bash
cd backend
npm install
npm run dev
```
The websocket replication server will start listening on `localhost:4000`.

### 2. Start the Frontend Client
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
The application will launch and be accessible at `http://localhost:5173`. 

## 🔧 Workflow
1. Navigate to the frontend URL.
2. Enter your desired display name on the welcome screen.
3. Click "Create New Room" to generate a unique collaborative session.
4. Use the "Share Room" button in the upper right to copy the link and distribute it to your teammates.
5. Watch them appear in the "Online Users" list and start coding together instantly!