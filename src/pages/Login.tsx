import type { FormEvent } from "react";
import useAuthStore from "../stores/AuthStore";
import { useNavigate } from "react-router-dom";
export default function Login() {
  const { username, password, setUsername, setPassword, login } =
    useAuthStore();
  const navigate = useNavigate();
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (username && password) {
      login();
      //   alert(`Login sukses sebagai ${username}`);
      navigate("/dashboard");
    } else {
      alert("Harap isi username dan password!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary/10 to-ternary/10">
      <div className="w-full max-w-md p-8 bg-white shadow-2xl rounded-2xl">
        <h2 className="text-3xl font-bold text-center text-primary mb-6">
          Admin Sawit
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
            />
          </div>

          <button
            type="submit"
            className="btn w-full rounded-lg p-2 hover:cursor-pointer bg-primary hover:bg-primary/90 text-white font-medium"
          >
            Login
          </button>
        </form>

        <p className="text-sm text-gray-500 text-center mt-6">© 2025 SOTANI</p>
      </div>
    </div>
  );
}
