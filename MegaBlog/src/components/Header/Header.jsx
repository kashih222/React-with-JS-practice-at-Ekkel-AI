import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import LogoutBtn from "../LogoutBtn";

const Header = () => {
  const authStatus = useSelector((state) => state.auth.status);
  const navigate = useNavigate();

  const navItems = [
    { name: "Home", slug: "/", active: true },
    { name: "Login", slug: "/login", active: !authStatus },
    { name: "Signup", slug: "/signup", active: !authStatus },
    { name: "All Post", slug: "/all-posts", active: authStatus },
    { name: "Add Post", slug: "/add-post", active: authStatus },
  ];

  return (
    <div className="py-3 bg-gray-500">
      <div className="max-w-7xl mx-auto px-4">
        <nav className="flex items-center">
          {/* Logo */}
          <div className="mr-4">
            <Link to="/">
              <h2 className="text-2xl font-bold text-white">My Blog</h2>
            </Link>
          </div>

          {/* Nav Items */}
          <ul className="flex ml-auto gap-2">
            {navItems.map(
              (item) =>
                item.active && (
                  <li key={item.name}>
                    <button
                      className="py-2 px-3 duration-200 text-white hover:text-orange-300 rounded-xl"
                      onClick={() => navigate(item.slug)}
                    >
                      {item.name}
                    </button>
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
