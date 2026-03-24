import { Editor } from "@monaco-editor/react";
import type { OnMount } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { useRef, useState, useEffect } from "react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { MonacoBinding } from "y-monaco";
import { Copy, Users } from "lucide-react";

interface CodeShareProps {
  roomId: string;
  username: string;
}

const colors = ["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#6366f1", "#ec4899", "#8b5cf6", "#14b8a6"];
const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

const CodeShare = ({ roomId, username }: CodeShareProps) => {
  const monacoRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const providerRef = useRef<WebsocketProvider | null>(null);
  const [activeUsers, setActiveUsers] = useState<any[]>([]);

  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSetup: OnMount = (editor) => {
    monacoRef.current = editor;

    // 1. initialize shared YJS object
    const sharedObject = new Y.Doc();

    // 2. Create a Websocket provider
    const wsUrl = import.meta.env.VITE_WS_URL || "ws://localhost:4000";
    
    const provider = new WebsocketProvider(
      wsUrl,
      roomId,
      sharedObject,
      { params: { auth: username } }
    );
    providerRef.current = provider;

    // 3. Connect document to editor
    const monacoBinding = new MonacoBinding(
      sharedObject.getText("monaco"),
      monacoRef.current.getModel()!,
      new Set([monacoRef.current]),
      provider.awareness
    );

    // 4. Setup Awareness (User identity & cursors)
    const userColor = getRandomColor();
    provider.awareness.setLocalStateField("user", {
      name: username,
      color: userColor,
    });

    // 5. Listen to awareness changes to show active users and typing indicators
    provider.awareness.on("change", () => {
      const states = Array.from(provider.awareness.getStates().values());
      setActiveUsers(states);
    });

    console.log("Connected to websocket provider:", provider, "Monaco binding:", monacoBinding);
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (providerRef.current) {
        providerRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className="flex flex-col h-screen bg-neutral-900 border-x border-neutral-800">
      {/* Header Panel */}
      <div className="flex items-center justify-between px-6 py-4 bg-neutral-950 border-b border-neutral-800">
        <div className="flex flex-col">
          <h1 className="text-xl font-bold text-cyan-400">Collaboration Room</h1>
          <span className="text-xs text-neutral-500 font-mono mt-1">ID: {roomId}</span>
        </div>

        <div className="flex items-center space-x-6">
            {/* Active Users */}
            <div className="flex flex-col items-end">
              <div className="flex items-center text-sm font-medium text-neutral-300">
                <Users className="w-4 h-4 mr-2 text-cyan-500" />
                <span>
                 {activeUsers.filter(u => u.user?.name).length} Online
                </span>
                <div className="ml-3 flex -space-x-2 overflow-hidden">
                  {activeUsers.filter(u => u.user?.name).map((userState, idx) => (
                    <div 
                      key={idx} 
                      title={userState.user.name}
                      className="inline-block h-6 w-6 rounded-full ring-2 ring-neutral-950 flex items-center justify-center text-[10px] font-bold text-white shadow-sm"
                      style={{ backgroundColor: userState.user.color }}
                    >
                      {userState.user.name.substring(0,2).toUpperCase()}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <button
                onClick={handleCopyLink}
                className="flex items-center px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-medium rounded-lg transition-colors border border-neutral-700"
            >
                <Copy className="w-4 h-4 mr-2" />
                {copied ? "Copied Link!" : "Share Room"}
            </button>
        </div>
      </div>

      {/* Editor Space */}
      <div className="flex-1 w-full bg-[#1e1e1e]">
        <Editor
          height="100%"
          defaultLanguage="javascript"
          defaultValue="// Welcome to liveCodeShare! Start typing...&#10;"
          theme="vs-dark"
          onMount={handleSetup}
          options={{
           minimap: { enabled: false },
           fontSize: 14,
           wordWrap: "on",
           padding: { top: 16 }
          }}
        />
      </div>
    </div>
  );
};

export default CodeShare;