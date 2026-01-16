import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import authService from "./appwrite/auth";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import { login, logOut } from "./store/features/authSlice";

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

  return !loading ? (
    <div className="h-screen w-full">
      <Header />
      <main>
        {/* <Outlet /> */}
      </main>
      <Footer />
    </div>
  ) : null;
}

export default App;
