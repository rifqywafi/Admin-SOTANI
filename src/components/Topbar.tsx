import useAuthStore from "../stores/AuthStore";
export default function Topbar() {
  const { user, logout } = useAuthStore();
  return (
    <div className="flex justify-between items-center bg-green-200 shadow p-4">
      <span className="font-semibold">
        Halo, {user?.username ?? "Admin"}
      </span>
      <button
        onClick={logout}
        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
}
