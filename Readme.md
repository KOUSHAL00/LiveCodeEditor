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

---

## 🧠 How it Works: Understanding CRDTs

### What is a CRDT?
A CRDT (**Conflict-free Replicated Data Type**) is a special kind of data structure designed for distributed systems where multiple users/devices update the same data at the same time, without needing locks or a central authority.

**Core idea:** All replicas can:
1. Update independently
2. Sync later
3. And still end up with the same final state!

### 🔧 Why CRDTs exist
In real-time apps (Google Docs, Figma, code editors), multiple users edit simultaneously, network delays happen, and offline edits occur. 

Traditional approaches fall short:
*   ❌ **Locking** → slow / bad UX
*   ❌ **Last-write-wins** → data loss

**CRDTs solve this by designing operations that never conflict.**

### ⚙️ How CRDT works
CRDTs rely on 3 mathematical guarantees:
1. **Commutativity:** Operations can arrive in any order → result is the same.
2. **Idempotency:** Applying the same update twice → no change.
3. **Associativity:** Grouping of operations doesn’t matter.

### 📦 Types of CRDTs
1. **Operation-based (Op-based):** Sends operations like "insert 'a' at position 3". Requires reliable delivery.
2. **State-based (Gossip-based):** Sends full or partial state and merges using mathematical rules.

### 🧾 Example (Text CRDT)
Two users edit `Hello`:
*   User A types `Hello!`.
*   User B types `Hello world`.

Instead of overwriting one another, the **CRDT merges** them into `Hello world!`. It works because each character receives a strictly unique ID and order is preserved via metadata (not simply its position index).

### 🔁 How updates are handled
A CRDT internally stores:
*   operations (insert/delete)
*   metadata (timestamps, client IDs, positions)

**Flow:** User types → local update applied immediately → operation is broadcast → other clients receive & merge → all converge to the exact same state.

---

## 🚀 Enter Yjs (The Real CRDT Engine)
[Yjs](https://yjs.dev/) is a high-performance, industry-leading CRDT implementation in JavaScript.

**What Yjs gives you:**
*   Shared data types (`Y.Text`, `Y.Map`, etc.)
*   Real-time sync and Offline support
*   Tiny updates (highly compressed binary diffs)
*   **Awareness** (cursor positions, usernames, and presence)

### 🧱 Yjs Core Concepts
1. **Document:** `const ydoc = new Y.Doc()`
2. **Shared Types:** `const yText = ydoc.getText('editor')`
3. **Updates:** Encoded binary updates pushed efficiently via WebSocket or WebRTC.

### 🌐 Transport layer (WSS)
Typically powered by a WebSocket server (Node.js) and the `y-websocket` protocol. 
The server just **relays updates**—it does NOT actively resolve conflicts. The CRDT logic cleanly handles that right on the clients.

---

## ⚛️ Yjs + React + Monaco Editor (Architecture)
We’ve designed a Google Docs experience specifically tailored for code.

### 🏗️ Architecture Flow
`React (Monaco Editor)` → `Yjs (CRDT Data Store)` → `WebSocket Provider` → `Node.js WebSockets Server` → `Other Networked Clients`

