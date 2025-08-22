export default function Spinner() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      <p className="ml-3 text-primary font-medium">Loading...</p>
    </div>
  );
}
