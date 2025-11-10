import { Suspense } from "react";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

// Loading Screen Component
function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-[#662FFF] rounded-full animate-spin"></div>
        <p className="text-gray-600 font-semibold">Loading...</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<LoadingScreen />}>
        <RouterProvider router={router} />
      </Suspense>
    </QueryClientProvider>
  );
}

export default App;