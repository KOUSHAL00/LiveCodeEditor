import { BrowserRouter, Routes, Route, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import CodeShare from "./Components/molecule/CodeShare";
import { v4 as uuidv4 } from "uuid";

const Home = () => {

  const navigate = useNavigate();

  const [name, setName] = useState(localStorage.getItem("username") || "");

  // Function to handle room creation
  const handleCreateRoom = () => {

    if (!name.trim()) return alert("Please enter your name");
    localStorage.setItem("username", name.trim());
    const newRoomId = uuidv4();
    navigate(`/room/${newRoomId}`);

  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-900 text-white p-4">
      <div className="max-w-md w-full bg-neutral-800 p-8 rounded-xl shadow-2xl border border-neutral-700">
        <h1 className="text-3xl font-bold text-cyan-400 mb-6 text-center">liveCodeShare</h1>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">Your Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
              placeholder="Enter your name to join..."
            />
          </div>
          <button
            onClick={handleCreateRoom}
            className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg transition-colors"
          >
            Create New Room
          </button>
        </div>
      </div>
    </div>
  );
};

// Component to handle the room view and joining logic
const RoomView = () => {

  const { roomId } = useParams();

  const [name, setName] = useState(localStorage.getItem("username") || "");

  const [hasJoined, setHasJoined] = useState(!!localStorage.getItem("username"));

  const handleJoin = () => {
    
    if (!name.trim()) return alert("Please enter your name");
    localStorage.setItem("username", name.trim());
    setHasJoined(true);
  };

  if (!hasJoined) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-900 text-white p-4">
        <div className="max-w-md w-full bg-neutral-800 p-8 rounded-xl shadow-2xl border border-neutral-700">
          <h2 className="text-2xl font-bold text-cyan-400 mb-6 text-center">Join Room</h2>
          <div className="space-y-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
              placeholder="What's your name?"
            />
            <button
              onClick={handleJoin}
              className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg transition-colors"
            >
              Join Collaboration
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <CodeShare roomId={roomId!} username={name} />;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/room/:roomId" element={<RoomView />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;