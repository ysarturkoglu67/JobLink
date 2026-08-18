import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import socket from "../socket";
import toast from "react-hot-toast";

const Messages = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChats();

    const handleNewMessage = () => {
      loadChats();
    };

    socket.on("new-message", handleNewMessage);

    return () => {
      socket.off("new-message", handleNewMessage);
    };
  }, []);

  const loadChats = async () => {
    try {
      const res = await api.get("/messages/conversations");

      setChats(res.data.chats || []);
    } catch (error) {
      console.error("CONVERSATIONS ERROR:", error);

      toast.error(
        error.response?.data?.message ||
        "Konuşmalar yüklenemedi."
      );
    } finally {
      setLoading(false);
    }
  };

  const getAvatar = (avatar, name) => {
    if (!avatar) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(
        name || "User"
      )}`;
    }

    if (avatar.startsWith("http")) {
      return avatar;
    }

    return `http://localhost:5000${avatar}`;
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        Yükleniyor...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">

      <div className="flex justify-between items-center mb-8">

        <h1 className="text-3xl font-bold">
          Mesajlar
        </h1>

      </div>

      {chats.length === 0 ? (

        <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500">
          Henüz konuşmanız bulunmuyor.
        </div>

      ) : (

        <div className="space-y-4">

          {chats.map((chat) => {

            if (!chat.user?._id) return null;

            return (
              <Link
                key={chat.user._id}
                to={`/chat/${chat.user._id}`}
                className="flex justify-between items-center bg-white rounded-xl shadow p-5 hover:bg-gray-50 transition"
              >

                <div className="flex items-center gap-4">

                  <img
                    src={getAvatar(
                      chat.user.avatar,
                      chat.user.name
                    )}
                    alt={chat.user.name}
                    className="w-14 h-14 rounded-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src =
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          chat.user.name || "User"
                        )}`;
                    }}
                  />

                  <div>

                    <h2 className="font-bold text-lg">
                      {chat.user.name}
                    </h2>

                    <p className="text-gray-500 mt-1 line-clamp-1">
                      {chat.lastMessage}
                    </p>

                    {chat.createdAt && (
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(
                          chat.createdAt
                        ).toLocaleString("tr-TR")}
                      </p>
                    )}

                  </div>

                </div>

                <span className="text-gray-400 text-xl">
                  →
                </span>

              </Link>
            );
          })}

        </div>

      )}

    </div>
  );
};

export default Messages;