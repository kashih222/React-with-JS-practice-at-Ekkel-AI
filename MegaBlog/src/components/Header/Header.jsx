import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import LogoutBtn from "../LogoutBtn";
import MEGABLOG from "../../assets/Mega.png";

const Header = () => {
  const authStatus = useSelector((state) => state.auth.status);

  const navItems = [
    { name: "Home", slug: "/", active: true },
    { name: "Login", slug: "/login", active: !authStatus },
    { name: "Signup", slug: "/signup", active: !authStatus },
    { name: "AboutPage", slug: "/about", active: authStatus },
    { name: "AllPost", slug: "/all-posts", active: authStatus },
    { name: "AddPost", slug: "/add-post", active: authStatus },
  ];

  return (
    <div className="py-3 fixed top-0 right-0 left-0 font-mono w-full bg-white shadow-xl z-50">
      <div className="max-w-7xl mx-auto px-4">
        <nav className="flex items-center">
          {/* Logo */}
          <div className="mr-4">
            <NavLink to="/" className="flex items-center">
              <img src={MEGABLOG} className="mr-3 w-16" alt="Logo" />
            </NavLink>
          </div>

          {/* Nav Items */}
          <ul className="flex items-center ml-auto gap-2">
            {navItems.map(
              (item) =>
                item.active && (
                  <li key={item.name}>
                    <NavLink
                      to={item.slug}
                      className={({ isActive }) => {
                        if (item.name === "Login") {
                          return `py-2 px-4 rounded-xl border border-yellow-400 text-black  hover:bg-yellow-50 duration-200 ${
                            isActive ? "bg-yellow-400 text-white" : ""
                          }`;
                        } else if (item.name === "Signup") {
                          return `py-2 px-4 rounded-xl bg-yellow-400 text-white  hover:bg-yellow-500 duration-200 ${
                            isActive ? "ring-1 ring-yellow-500" : ""
                          }`;
                        } else {
                          return `py-2 px-3 duration-200 cursor-pointer rounded-xl ${
                            isActive
                              ? "text-yellow-400"
                              : "text-gray-700 hover:text-gray-900"
                          }`;
                        }
                      }}
                    >
                      {item.name}
                    </NavLink>
                  </li>
                )
            )}

            {authStatus && (
              <li>
                <LogoutBtn />
              </li>
            )}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Header;
