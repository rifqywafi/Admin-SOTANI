import { useState } from "react";
import useAuthStore from "../stores/AuthStore";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // state loading baru
  const login = useAuthStore((s) => s.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);  // mulai loading
    const success = await login(username, password);
    setLoading(false); // selesai loading

    if (success) {
      toast.success("Login berhasil 🚀");
      navigate("/dashboard");
    } else {
      toast.error("Username atau password salah ❌");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary/10 to-ternary/10">
      <div className="w-full max-w-md p-8 bg-white shadow-2xl rounded-2xl">
        <h2 className="text-3xl font-bold text-center text-primary mb-6">
          SOTANI Admin
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="input input-bordered w-full rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary/60"
              required
              disabled={loading} // disable saat loading
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="input input-bordered w-full rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary/60"
              required
              disabled={loading} // disable saat loading
            />
          </div>

          <button
            type="submit"
            disabled={loading} // disable tombol saat loading
            className={`btn w-full rounded-lg p-2 font-medium text-white ${
              loading
                ? "bg-primary/70 cursor-not-allowed"
                : "bg-primary hover:bg-primary/90 cursor-pointer"
            }`}
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>

        <p className="text-sm text-gray-500 text-center mt-6">© 2025 SOTANI</p>
      </div>

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        pauseOnFocusLoss
        theme="colored"
      />
    </div>
  );
}
