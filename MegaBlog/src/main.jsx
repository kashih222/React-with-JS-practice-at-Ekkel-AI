import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./store/store.js";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import HomePage from "./components/pages/HomePage.jsx";
import LoginPage from "./components/pages/LoginPage.jsx";
import SignupPage from "./components/pages/SignupPage.jsx";
import MyPostPage from "./components/pages/MyPostPage.jsx";
import AddPostPage from "./components/pages/AddPostPage.jsx";
import EditPostPage from "./components/pages/EditPostPage.jsx";
import PostPage from "./components/pages/PostPage.jsx";
import Protected from "./components/AuthLayout.jsx";
import AboutPage from "./components/pages/Aboutpage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/login",
        element: (
          <Protected authentication={false}>
            <LoginPage />
          </Protected>
        ),
      },
      {
        path: "/signup",
        element: (
          <Protected authentication={false}>
            <SignupPage />
          </Protected>
        ),
      },
       {
        path: "/about",
        element: (
          <Protected authentication>
            <AboutPage />
          </Protected>
        ),
      },
      {
        path: "/my-posts",
        element: (
          <Protected authentication>
            <MyPostPage />
          </Protected>
        ),
      },
      {
        path: "/add-post",
        element: (
          <Protected authentication>
            <AddPostPage />
          </Protected>
        ),
      },
      {
        path: "/edit-post/:slug",
        element: (
          <Protected authentication>
            <EditPostPage />
          </Protected>
        ),
      },
      {
        path: "/post/:slug",
        element: (
          <Protected authentication>
            <PostPage />
          </Protected>
        ),
      },
    ],
  },
]);

const loader = document.getElementById("initial-loader");
if (loader) {
  loader.remove();
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
