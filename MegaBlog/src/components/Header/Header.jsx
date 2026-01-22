import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";
import LogoutBtn from "../LogoutBtn";
import MEGABLOG from "../../assets/Mega.png";

const Header = () => {
  const authStatus = useSelector((state) => state.auth.status);
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", slug: "/", active: true },
    { name: "Login", slug: "/login", active: !authStatus },
    { name: "Signup", slug: "/signup", active: !authStatus },
    { name: "AboutPage", slug: "/about", active: authStatus },
    { name: "MyPost", slug: "/my-posts", active: authStatus },
    { name: "AddPost", slug: "/add-post", active: authStatus },
  ];

  const linkStyle =
    (item) =>
    ({ isActive }) => {
      if (item.name === "Login") {
        return `py-2 px-4 rounded-xl border border-yellow-400 text-black hover:bg-yellow-50 duration-200 ${
          isActive ? "bg-yellow-400 text-white" : ""
        }`;
      } else if (item.name === "Signup") {
        return `py-2 px-4 rounded-xl bg-yellow-400 text-white hover:bg-yellow-500 duration-200 ${
          isActive ? "ring-1 ring-yellow-500" : ""
        }`;
      } else {
        return `py-2 px-3 duration-200 cursor-pointer rounded-xl ${
          isActive ? "text-yellow-400" : "text-gray-700 hover:text-gray-900"
        }`;
      }
    };

  return (
    <div className="py-3 fixed top-0 right-0 left-0 font-mono w-full bg-white shadow-xl z-50">
      <div className="max-w-7xl mx-auto px-4">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <NavLink to="/" className="flex items-center">
            <img src={MEGABLOG} className="mr-3 w-16" alt="Logo" />
          </NavLink>

          {/* Desktop Menu */}
          <ul className="hidden md:flex items-center gap-2">
            {navItems.map(
              (item) =>
                item.active && (
                  <li key={item.name}>
                    <NavLink to={item.slug} className={linkStyle(item)}>
                      {item.name}
                    </NavLink>
                  </li>
                ),
            )}

            {authStatus && (
              <li>
                <LogoutBtn />
              </li>
            )}
          </ul>

          <button
            className="md:hidden flex flex-col gap-1"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className="w-6 h-0.5 bg-black"></span>
            <span className="w-6 h-0.5 bg-black"></span>
            <span className="w-6 h-0.5 bg-black"></span>
          </button>
        </nav>
      </div>

      {/* Dark Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Mobile Slide Menu */}
      <div
        className={`fixed top-0 right-0 h-screen w-2/3 max-w-xs bg-white shadow-2xl z-50 transform transition-all duration-300 ease-in-out ${
          menuOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        } rounded-l-3xl`}
      >
        <div className="h-20 flex  items-center justify-center border-b bg-linear-to-r from-yellow-100 to-white">
          <h2 className="text-xl font-bold text-yellow-500">MegaBlog</h2>
        </div>

        {/* Menu Items */}
        <ul className="flex flex-col h-full pt-6 gap-2 px-4">
         {navItems.map(
  (item) =>
    item.active &&
    item.name !== "Login" &&
    item.name !== "Signup" && (
      <li
        key={item.name}
        onClick={() => setMenuOpen(false)}
        className="w-full"
      >
        <NavLink
          to={item.slug}
          className={({ isActive }) =>
            `block w-full py-3 px-4 rounded-xl text-lg font-medium transition-all duration-200 ${
              isActive
                ? "bg-yellow-400 text-white shadow-md"
                : "text-gray-700 hover:bg-yellow-50 hover:text-yellow-500"
            }`
          }
        >
          {item.name}
        </NavLink>
      </li>
    ),
)}


          <div className="pb-10 space-y-3">
            {!authStatus && (
              <>
                <NavLink
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="block w-full text-center py-3 rounded-xl border border-yellow-400 text-black hover:bg-yellow-50 transition"
                >
                  Login
                </NavLink>

                <NavLink
                  to="/signup"
                  onClick={() => setMenuOpen(false)}
                  className="block w-full text-center py-3 rounded-xl bg-yellow-400 text-white hover:bg-yellow-500 transition"
                >
                  Signup
                </NavLink>
              </>
            )}

            {authStatus && (
              <>
                <div className="border-t my-3" />
                <div
                  onClick={() => setMenuOpen(false)}
                  className="flex justify-center"
                >
                  <LogoutBtn />
                </div>
              </>
            )}
          </div>
        </ul>
      </div>
    </div>
  );
};

export default Header;
