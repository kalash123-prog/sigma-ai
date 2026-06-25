import "./sidebar.css";
import { useContext, useEffect } from "react";
import Mycontext from "./Mycontext";
import { v1 as uuidv1 } from "uuid";

function Sidebar() {
  const {
    thread,
    setthread,
    currthreadid,
    setcurrthreadid,
    setprevchat,
    setreply,
    setprompt,
    setnewchat,
  } = useContext(Mycontext);

  const getallthreads = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/thread", {
        credentials: "include", // Required for logged-in user!
      });
      const data = await response.json();

      const threads = data.map((item) => ({
        thread: item.title,
        threadid: item.thread_id,
      }));

      setthread(threads);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getallthreads();
  }, []);

  useEffect(() => {
    if (!currthreadid) return;

    const getMessages = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/thread/${currthreadid}`,
          {
            credentials: "include", // Required for logged-in user!
          }
        );

        const data = await response.json();

        setprevchat(data.messages || []);
        // setnewchat(false);
      } catch (err) {
        console.error("Error fetching thread:", err);
      }
    };

    getMessages();
  }, [currthreadid]);

  const deleteThread = async (threadId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/thread/${threadId}`,
        {
          method: "DELETE",
          credentials: "include", // Required for logged-in user!
        }
      );

      const data = await response.json();

      if (data.success) {
        // Remove thread from sidebar instantly
        setthread((prev) =>
          prev.filter((item) => item.threadid !== threadId)
        );

        // If current opened thread is deleted
        if (currthreadid === threadId) {
          setcurrthreadid(null);
          setprevchat([]);
          setreply(null);
          setprompt("");
          setnewchat(true);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const updatehistory = async () => {
    const response = await fetch("http://localhost:3000/api/thread", {
      credentials: "include", // Required for logged-in user!
    });
    const data = await response.json();

    setthread(
      data.map((item) => ({
        thread: item.title,
        threadid: item.thread_id,
      }))
    );
  };

  return (
    <div className="side">
      <button
        className="btn"
        onClick={() => {
          setcurrthreadid(uuidv1());
          setprevchat([]);
          setreply(null);
          setprompt("");
          setnewchat(true);
          updatehistory();
        }}
      >
        <img
          src="src/assets/image.png"
          alt="logo"
          className="logo"
        />
        <i className="fa-regular fa-pen-to-square"></i>
      </button>

      <ul className="history">
        {thread?.map((item) => (
          <li
            key={item.threadid}
            onClick={() => {
              setcurrthreadid(item.threadid);
              updatehistory();
              setnewchat(false);
            }}
          >
            <span>{item.thread}</span>

            <div
              className="cross"
              onClick={(e) => {
                // we use this because by clicking button it causes event bubbling because this button is a child container and it will also call parent
                e.stopPropagation(); 
                deleteThread(item.threadid);
              }}
            >
              <i className="fa-regular fa-circle-xmark"></i>
            </div>
          </li>
        ))}
      </ul>

      <div className="sign">By Kalash Mane</div>
    </div>
  );
}

export default Sidebar;