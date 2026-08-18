import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../api/axios";
import socket from "../socket";
import toast from "react-hot-toast";

const Chat = () => {
  const { userId } = useParams();
  const { user } = useSelector((state) => state.auth);

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [typing, setTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const bottomRef = useRef(null);
  const typingTimeout = useRef(null);

  // Kullanıcıyı Socket odasına dahil et
  useEffect(() => {
    if (!user?._id) return;

    socket.emit("join", user._id);

    return () => {
      clearTimeout(typingTimeout.current);
    };
  }, [user]);

  // Mesajları getir
  useEffect(() => {
    if (!userId) return;

    loadMessages();
  }, [userId]);

  // Socket eventleri
  useEffect(() => {
    const handleReceiveMessage = (message) => {
      setMessages((prev) => {
        if (
          prev.some(
            (msg) => msg._id === message._id
          )
        ) {
          return prev;
        }

        return [...prev, message];
      });
    };

    const handleOnlineUsers = (users) => {
      setOnlineUsers(users);
    };

    const handleTyping = (sender) => {
      if (sender === userId) {
        setTyping(true);
      }
    };

    const handleStopTyping = () => {
      setTyping(false);
    };

    socket.on(
      "receive-message",
      handleReceiveMessage
    );

    socket.on(
      "online-users",
      handleOnlineUsers
    );

    socket.on(
      "typing",
      handleTyping
    );

    socket.on(
      "stop-typing",
      handleStopTyping
    );

    return () => {
      socket.off(
        "receive-message",
        handleReceiveMessage
      );

      socket.off(
        "online-users",
        handleOnlineUsers
      );

      socket.off(
        "typing",
        handleTyping
      );

      socket.off(
        "stop-typing",
        handleStopTyping
      );
    };
  }, [userId]);

  // En alta kaydır
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, typing]);

  // Mesaj geçmişi
  const loadMessages = async () => {
    try {
      setLoading(true);

      const res = await api.get(
        `/messages/${userId}`
      );

      setMessages(res.data.messages || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Mesajlar yüklenemedi."
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!userId) return;

    const markRead = async () => {
      try {
        await api.put(`/messages/${userId}/read`);
      } catch (error) {
        console.log(
          "Mesajlar okundu yapılamadı:",
          error
        );
      }
    };

    markRead();
  }, [userId]);

  // Mesaj gönder
  const sendMessage = async () => {
    const messageText = text.trim();

    if (!messageText) return;

    try {
      const res = await api.post("/messages", {
        receiver: userId,
        message: messageText,
      });

      const newMessage = res.data.message;

      // Kendi ekranımıza ekle
      setMessages((prev) => {
        if (
          prev.some(
            (msg) => msg._id === newMessage._id
          )
        ) {
          return prev;
        }

        return [...prev, newMessage];
      });

      // Karşı tarafa Socket.IO ile gönder
      socket.emit("send-message", newMessage);

      setText("");

      socket.emit("stop-typing", {
        receiver: userId,
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Mesaj gönderilemedi."
      );
    }
  };

  // Yazıyor
  const handleTyping = (e) => {
    const value = e.target.value;

    setText(value);

    if (!user?._id) return;

    if (value.trim()) {
      socket.emit("typing", {
        sender: user._id,
        receiver: userId,
      });
    }

    clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {
      socket.emit("stop-typing", {
        receiver: userId,
      });
    }, 800);
  };

  const isOnline = onlineUsers.includes(userId);

  return (
    <div className="max-w-5xl mx-auto h-[85vh] bg-white rounded-xl shadow flex flex-col">

      {/* Header */}
      <div className="border-b p-5 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">
            Mesajlar
          </h1>

          <p
            className={`mt-2 text-sm ${isOnline
                ? "text-green-600"
                : "text-gray-500"
              }`}
          >
            {isOnline
              ? "🟢 Online"
              : "⚪ Çevrimdışı"}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">

        {loading ? (
          <p className="text-center text-gray-500">
            Mesajlar yükleniyor...
          </p>
        ) : messages.length === 0 ? (
          <p className="text-center text-gray-500">
            Henüz mesaj bulunmuyor.
          </p>
        ) : (
          messages.map((msg) => {
            const mine =
              msg.sender === user?._id ||
              msg.sender?._id === user?._id;

            return (
              <div
                key={msg._id}
                className={`flex ${mine
                    ? "justify-end"
                    : "justify-start"
                  }`}
              >
                <div
                  className={`max-w-md px-4 py-3 rounded-2xl ${mine
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-black"
                    }`}
                >
                  <p>{msg.message}</p>

                  {msg.createdAt && (
                    <p className="text-xs opacity-70 mt-2 text-right">
                      {new Date(
                        msg.createdAt
                      ).toLocaleTimeString(
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
            );
          })
        )}

        {typing && (
          <p className="italic text-gray-500 animate-pulse">
            Karşı taraf yazıyor...
          </p>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t p-4 flex gap-3">

        <input
          type="text"
          value={text}
          onChange={handleTyping}
          placeholder="Mesaj yaz..."
          className="flex-1 border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onKeyDown={(e) => {
            if (
              e.key === "Enter" &&
              !e.shiftKey
            ) {
              e.preventDefault();
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