/**
 * Simple, elegant loading spinner for route transitions
 */
const RouteLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#faf8f5] to-[#f5f1ea]">
      <div className="w-8 h-8 border-3 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
    </div>
  );
};

export default RouteLoader;


