import { BrowserRouter } from "react-router-dom";
import { useState } from "react";
import { v1 as uuidv1 } from "uuid";
import "./App.css";

// Contexts
import Mycontext from "./Mycontext.jsx";
import { AuthProvider } from "./AuthContext.jsx"; // Assuming your Auth logic is saved here

// Components
import Sidebar from "./sidebar.jsx";
import Chatwindow from "./chatwindow.jsx";
import ImageGen from "./imagegen.jsx";
import AppRoutes from "./AppRoutes.jsx";

// ─── Main Chat Application UI ────────────────────────────────────────────────
// We separate this out so it can be safely used inside your router
export function ChatApp() {
  const [prompt, setprompt] = useState("");
  const [reply, setreply] = useState(null);
  const [currthreadid, setcurrthreadid] = useState(uuidv1());
  const [prevchat, setprevchat] = useState([]);
  const [newchat, setnewchat] = useState(true);
  const [thread, setthread] = useState([]);
  const [mode, setmode] = useState("chat");

  const providerValues = {
    prompt,
    setprompt,
    reply,
    setreply,
    currthreadid,
    setcurrthreadid,
    prevchat,
    setprevchat,
    newchat,
    setnewchat,
    thread,
    setthread,
    mode,
    setmode,
  };

  return (
    <Mycontext.Provider value={providerValues}>
      <div className="App">
        <Sidebar />
        {mode === "chat" && <Chatwindow />}
        {mode === "image" && <ImageGen />}
      </div>
    </Mycontext.Provider>
  );
}

// ─── App Entry Point (Router & Auth Wrappers) ────────────────────────────────
const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;