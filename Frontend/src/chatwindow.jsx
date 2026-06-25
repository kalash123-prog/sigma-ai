import "./chatwindow.css";
import { useContext, useState, useEffect } from "react";
import Mycontext from "./Mycontext";
import { ClipLoader } from "react-spinners";
import Chat from "./chat.jsx";
import VoiceInput from "./voiceinput.jsx";
import { useAuth } from "./AuthContext";

function Chatwindow() {
  const {
    prompt,
    setprompt,
    reply,
    setreply,
    currthreadid,
    prevchat,
    setprevchat,
    mode,
    setmode
  } = useContext(Mycontext);

  const { user, logout } = useAuth(); 

  const [loading, setloading] = useState(false);
  const [feature, setfeature] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const getreply = async () => {
    if (!prompt.trim()) return;

    setloading(true);

    try {
      const response = await fetch("http://localhost:3000/api/chat", {
        method: "POST",
        credentials: "include", // Required to authenticate the request
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          thread_id: currthreadid,
        }),
      });

      const data = await response.json();

      console.log(data);

      if (!response.ok) {
        setreply(data.error || "Something went wrong");
        return;
      }

      setreply(data.reply);
    } catch (err) {
      console.log(err);
      setreply("Failed to connect to server");
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    if (prompt && reply)
      setprevchat((prevchat) => [
        ...prevchat,
        {
          role: "user",
          message: prompt,
        },
        {
          role: "assistant",
          message: reply,
        },
      ]);
    setprompt("");
  }, [reply]);

  const drop = () => {
    setfeature(!feature);
  };

  const handleLogout = async () => {
    await logout();
    setShowProfileMenu(false);
  };

  return (
    <div className="window">
      <div className="navbar">
        <div className="nav-left">
          <i className="fa-solid fa-bars" onClick={drop}></i>
          {/* Capitalized properly for branding */}
          <h2>Sigma AI</h2>
        </div>

        <div className="nav-right">
          <button className="upgrade-btn">Upgrade</button>
          <div className="profile-container">
            <div
              className="profile"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              style={{ overflow: "hidden", padding: 0, display: "flex", justifyContent: "center", alignItems: "center" }}
            >
              {user ? (
                <img 
                  src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${user.username}`} 
                  alt="avatar" 
                  style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                />
              ) : (
                <i className="fa-solid fa-user" style={{ fontSize: "18px" }}></i>
              )}
            </div>

            {showProfileMenu && (
              <div className="profile-menu">
                {user ? (
                  <>
                    <div className="profile-user-info" style={{ padding: '8px', borderBottom: '1px solid #ccc', marginBottom: '8px' }}>
                      <small>Signed in as <b>{user.username}</b></small>
                    </div>
                    <button onClick={handleLogout}>
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => window.location.href = "/login"}>
                      Login
                    </button>
                    <button onClick={() => window.location.href = "/signup"}>
                      Signup
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

     {feature && (
        <div className="feature">
          <ul>
            <li onClick={() => {
              setmode("chat");
              setfeature(false); // Closes menu
            }}>Chat</li>
            
            {/* ─── ADDED: Click event to trigger the mic and close menu ─── */}
            <li onClick={() => {
              setfeature(false); // Closes menu
              document.getElementById("sigma-mic-btn")?.click(); // Turns on the mic!
            }}>
              Voice feature
            </li>
          </ul>
        </div>
      )}

      <div className="chat-body">
        {/* Added wrapper div to perfectly center the loader */}
        {loading && (
          <div style={{ display: "flex", justifyContent: "center", padding: "20px 0" }}>
            <ClipLoader color="white" size={35} />
          </div>
        )}
        <Chat />
      </div>

      <div className="chat-input-container">
        <div className="chat-input-box">
          <input
            type="text"
            /* Placeholder updated to Sigma AI */
            placeholder="Message Sigma AI..."
            className="chat-input"
            value={prompt}
            onChange={(e) => setprompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !loading) {
                getreply();
              }
            }}
          />

          <VoiceInput />

          <div className="chatdis"></div>

          <button
            className="send-btn"
            id="submit"
            onClick={getreply}
            disabled={loading}
          >
            <i className="fa-solid fa-arrow-up"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chatwindow;