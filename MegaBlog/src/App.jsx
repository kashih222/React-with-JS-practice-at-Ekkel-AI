import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import authService from "./appwrite/auth";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import { login, logOut } from "./store/features/authSlice";
import { Toaster } from "react-hot-toast"; 
import FullLoader from "./components/FullLoader";   

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    authService
      .getCurrentUser()
      .then((userData) => {
        if (userData) {
          dispatch(login({ userData }));
        } else {
          dispatch(logOut());
        }
      })
      .catch(() => dispatch(logOut()))
      .finally(() => setLoading(false));
  }, [dispatch]);

  if (loading) return <FullLoader />;

  return (
    <div className="min-h-screen w-full flex flex-col relative">
    <div className="min-h-screen w-full flex flex-col">
      <Header/>
      <Toaster position="top-right" reverseOrder={false} />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
    </div>
  );
}

export default App;
