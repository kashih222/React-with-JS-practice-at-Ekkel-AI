import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import authService from "./appwrite/auth";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import { login, logOut } from "./store/features/authSlice";
import { Toaster } from "react-hot-toast"; 

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

  if (loading) return null;

  return (
    <div className="h-screen w-full">
      <Header />
      
      <Toaster position="top-right" reverseOrder={false} />

      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default App;
