import useAuthStore from "../stores/AuthStore";
export default function Topbar() {
  const { user, logout } = useAuthStore();
  return (
    <div className="flex justify-between items-center bg-secondary shadow p-4">
      <span className="font-semibold text-white">
        Halo, {user?.username ?? "Admin"}
      </span>
      <button
        onClick={logout}
        className="px-4 py-2 bg-primary text-white rounded-lg hover:cursor-pointer hover:bg-primary-dark transition"
      >
        Logout
      </button>
    </div>
  );
}
