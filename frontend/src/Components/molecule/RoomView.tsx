import React, { useState } from "react";
import { useParams } from "react-router-dom";
import CodeShare from "./CodeShare";

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

export default RoomView;