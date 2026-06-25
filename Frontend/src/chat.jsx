import "./chat.css";
import Mycontext from "./Mycontext";
import { useContext, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

function Chat() {
  const { newchat, prevchat ,setnewchat} = useContext(Mycontext);

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
    
  }, [prevchat]);

  return (
    <>
      {newchat && <h1>Start a new chat</h1>}

      <div className="chats">
        {prevchat?.map((chat, idx) => (
          <div
            className={chat.role === "user" ? "userdiv" : "gptdiv"}
            key={idx}
          >
            {chat.role === "user" ? (
              <div className="usermessage">
                {chat.message}
              </div>
            ) : (
              <div className="aimessage">
                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                  {chat.message}
                </ReactMarkdown>
              </div>
            )}
          </div>
        ))}

        <div ref={bottomRef}></div>
      </div>
    </>
  );
}

export default Chat;