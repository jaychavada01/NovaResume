import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import AuthPage from "./pages/AuthPage";

import { QueryClient, QueryClientProvider } from "react-query";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MainSpinner from "./components/MainSpinner";

const App = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<MainSpinner/>}>
        <Routes>
          <Route path="/*" element={<Home />} />
          <Route path="/auth" element={<AuthPage />} />
        </Routes>
      </Suspense>
      <ToastContainer position="top-right" theme="dark" />
    </QueryClientProvider>
  );
};
export default App;
