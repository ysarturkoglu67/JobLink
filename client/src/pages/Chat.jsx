import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../api/axios";
import toast from "react-hot-toast";

// Socket.IO kurunca açacağız
// import socket from "../socket";

const Chat = () => {
  const { userId } = useParams();

  const { user } = useSelector((state) => state.auth);

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);

  const bottomRef = useRef(null);

  useEffect(() => {
    loadMessages();
  }, [userId]);

  // Socket.IO hazır olduğunda açacağız
  /*
  useEffect(() => {
    socket.on("new-message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("new-message");
    };
  }, []);
  */

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const loadMessages = async () => {
    try {
      setLoading(true);

      const res = await api.get(`/messages/${userId}`);

      setMessages(res.data.messages);
    } catch (error) {
      toast.error("Mesajlar yüklenemedi.");
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!text.trim()) return;

    try {
      const res = await api.post("/messages", {
        receiver: userId,
        message: text.trim(),
      });

      setMessages((prev) => [...prev, res.data.message]);

      setText("");

      // Socket kurunca bunu açacağız
      // socket.emit("send-message", res.data.message);

    } catch (error) {
      toast.error("Mesaj gönderilemedi.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto h-[85vh] bg-white rounded-xl shadow flex flex-col">

      <div className="border-b p-5">
        <h1 className="text-2xl font-bold">
          Mesajlar
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4">

        {loading ? (
          <p className="text-center text-gray-500">
            Mesajlar yükleniyor...
          </p>
        ) : messages.length === 0 ? (
          <p className="text-center text-gray-500">
            Henüz mesaj yok.
          </p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg._id}
              className={`flex ${
                msg.sender === user.id ||
                msg.sender?._id === user.id
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-3 rounded-2xl max-w-md ${
                  msg.sender === user.id ||
                  msg.sender?._id === user.id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                <p>{msg.message}</p>

                {msg.createdAt && (
                  <p className="text-xs opacity-70 mt-2 text-right">
                    {new Date(msg.createdAt).toLocaleTimeString(
                      "tr-TR",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </p>
                )}
              </div>
            </div>
          ))
        )}

        <div ref={bottomRef}></div>

      </div>

      <div className="border-t p-4 flex gap-3">

        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Mesaj yaz..."
          className="flex-1 border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
        />

        <button
          onClick={sendMessage}
          disabled={!text.trim()}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 rounded-xl transition"
        >
          Gönder
        </button>

      </div>

    </div>
  );
};

export default Chat;