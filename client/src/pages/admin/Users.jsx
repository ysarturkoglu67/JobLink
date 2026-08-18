import { useEffect, useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";

import {
  Trash2,
  ShieldCheck,
  Lock,
  Unlock,
  Search,
} from "lucide-react";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, search, roleFilter]);

  const loadUsers = async () => {
    try {
      const res = await api.get("/admin/users");

      setUsers(res.data.users);
    } catch {
      toast.error("Kullanıcılar yüklenemedi.");
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let list = [...users];

    if (roleFilter !== "all") {
      list = list.filter(
        (user) => user.role === roleFilter
      );
    }

    if (search) {
      list = list.filter(
        (user) =>
          user.name
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          user.email
            .toLowerCase()
            .includes(search.toLowerCase())
      );
    }

    setFilteredUsers(list);
  };

  const deleteUser = async (id) => {
    if (!confirm("Kullanıcı silinsin mi?")) return;

    try {
      await api.delete(`/admin/users/${id}`);

      toast.success("Kullanıcı silindi.");

      loadUsers();
    } catch {
      toast.error("Silinemedi.");
    }
  };

  const toggleStatus = async (id) => {
    try {
      await api.patch(`/admin/users/${id}/status`);

      toast.success("Durum güncellendi.");

      loadUsers();
    } catch {
      toast.error("İşlem başarısız.");
    }
  };

  const verifyEmployer = async (id) => {
    try {
      await api.patch(`/admin/users/${id}/verify`);

      toast.success("İşveren doğrulandı.");

      loadUsers();
    } catch {
      toast.error("Doğrulanamadı.");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        Yükleniyor...
      </div>
    );
  }

  return (
    <div className="space-y-8">

      <h1 className="text-3xl font-bold">
        Kullanıcı Yönetimi
      </h1>

      <div className="bg-white rounded-xl shadow p-6">

        <div className="flex flex-col md:flex-row gap-4 mb-6">

          <div className="relative flex-1">

            <Search
              size={18}
              className="absolute left-3 top-3 text-gray-400"
            />

            <input
              type="text"
              placeholder="Kullanıcı ara..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full border rounded-lg pl-10 pr-4 py-2"
            />

          </div>

          <select
            value={roleFilter}
            onChange={(e) =>
              setRoleFilter(e.target.value)
            }
            className="border rounded-lg px-4 py-2"
          >

            <option value="all">
              Tüm Roller
            </option>

            <option value="candidate">
              Aday
            </option>

            <option value="employer">
              İşveren
            </option>

            <option value="admin">
              Admin
            </option>

          </select>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr className="border-b">

                <th className="text-left py-3">
                  Kullanıcı
                </th>

                <th>Rol</th>

                <th>Durum</th>

                <th>Doğrulama</th>

                <th>İşlemler</th>

              </tr>

            </thead>

            <tbody>
              {filteredUsers.map((user) => (

                <tr
                  key={user._id}
                  className="border-b hover:bg-gray-50"
                >

                  <td className="py-4">

                    <div className="flex items-center gap-3">

                      <img
                        src={
                          user.avatar
                            ? `http://localhost:5000${user.avatar}`
                            : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              user.name
                            )}`
                        }
                        alt={user.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />

                      <div>

                        <h3 className="font-semibold">
                          {user.name}
                        </h3>

                        <p className="text-sm text-gray-500">
                          {user.email}
                        </p>

                      </div>

                    </div>

                  </td>

                  <td>

                    <span
                      className={`px-3 py-1 rounded-full text-sm ${user.role === "admin"
                          ? "bg-red-100 text-red-700"
                          : user.role === "employer"
                            ? "bg-green-100 text-green-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                    >
                      {user.role}
                    </span>

                  </td>

                  <td>

                    <span
                      className={`px-3 py-1 rounded-full text-sm ${user.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                        }`}
                    >
                      {user.isActive
                        ? "Aktif"
                        : "Pasif"}
                    </span>

                  </td>

                  <td>

                    {user.role === "employer" ? (

                      user.isVerified ? (

                        <span className="text-green-600 font-semibold">
                          ✔ Doğrulandı
                        </span>

                      ) : (

                        <button
                          onClick={() =>
                            verifyEmployer(user._id)
                          }
                          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg"
                        >
                          <ShieldCheck size={16} />
                          Doğrula
                        </button>

                      )

                    ) : (

                      "-"

                    )}

                  </td>

                  <td>

                    <div className="flex gap-2 justify-center">

                      <button
                        onClick={() =>
                          toggleStatus(user._id)
                        }
                        className={`p-2 rounded-lg text-white ${user.isActive
                            ? "bg-yellow-500 hover:bg-yellow-600"
                            : "bg-green-600 hover:bg-green-700"
                          }`}
                      >
                        {user.isActive ? (
                          <Lock size={18} />
                        ) : (
                          <Unlock size={18} />
                        )}
                      </button>

                      <button
                        onClick={() =>
                          deleteUser(user._id)
                        }
                        className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg"
                      >
                        <Trash2 size={18} />
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
};

export default Users;
