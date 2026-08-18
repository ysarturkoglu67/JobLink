import { useEffect, useState } from "react";
import api from "../api/axios";
import socket from "../socket";
import toast from "react-hot-toast";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();

    socket.on("receive-notification", (notification) => {
      setNotifications((prev) => [
        notification,
        ...prev,
      ]);

      toast.success("Yeni bildirim geldi.");
    });

    return () => {
      socket.off("receive-notification");
    };
  }, []);

  const loadNotifications = async () => {
    try {
      const res = await api.get("/notifications");

      setNotifications(
        res.data.notifications || []
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Bildirimler yüklenemedi."
      );
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);

      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === id
            ? {
                ...notification,
                read: true,
              }
            : notification
        )
      );
    } catch (error) {
      toast.error("Bildirim okunamadı.");
    }
  };

  const markAllRead = async () => {
    try {
      await api.put("/notifications/read-all");

      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          read: true,
        }))
      );

      toast.success(
        "Tüm bildirimler okundu."
      );
    } catch (error) {
      toast.error(
        "Bildirimler güncellenemedi."
      );
    }
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

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

        <div>
          <h1 className="text-3xl font-bold">
            Bildirimler
          </h1>

          {unreadCount > 0 && (
            <p className="text-gray-500 mt-2">
              {unreadCount} okunmamış bildirim
            </p>
          )}
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Tümünü Okundu Yap
          </button>
        )}

      </div>

      {notifications.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500">
          Bildirim bulunmuyor.
        </div>
      ) : (
        <div className="space-y-4">

          {notifications.map(
            (notification) => (

              <div
                key={notification._id}
                onClick={() =>
                  !notification.read &&
                  markAsRead(
                    notification._id
                  )
                }
                className={`rounded-xl shadow p-5 border transition ${
                  notification.read
                    ? "bg-white"
                    : "bg-blue-50 border-blue-400 cursor-pointer"
                }`}
              >

                <div className="flex justify-between gap-4">

                  <div>

                    <h3 className="font-semibold">
                      {notification.text}
                    </h3>

                    <p className="text-sm text-gray-500 mt-2">
                      {new Date(
                        notification.createdAt
                      ).toLocaleString(
                        "tr-TR"
                      )}
                    </p>

                  </div>

                  {!notification.read && (
                    <span className="w-3 h-3 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                  )}

                </div>

              </div>

            )
          )}

        </div>
      )}

    </div>
  );
};

export default Notifications;