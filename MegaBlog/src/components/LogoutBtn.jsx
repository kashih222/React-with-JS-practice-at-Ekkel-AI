import React from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import authService from "../appwrite/auth";
import { logOut } from "../store/features/authSlice";

const LogoutBtn = () => {
    const dispatch = useDispatch()

    const logOutHandler = ()=>{
        authService.logout().then(()=>{
            dispatch(logOut())
        })
    }

  return (
      <div className="flex items-center lg:order-2">
        <Link
          onClick={logOutHandler}
          to="/"
          className="text-black/80 font-medium bg-yellow-400 hover:bg-yellow-300 focus:ring-4 focus:ring-orange-300  rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none"
        >
          LogOut
        </Link>
      </div>
  );
};

export default LogoutBtn;
