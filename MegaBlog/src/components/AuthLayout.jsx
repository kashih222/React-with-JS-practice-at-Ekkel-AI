import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Protected({ children, authentication = true }) {
  const navigate = useNavigate();

  const authStatus = useSelector((state) => state.auth.status);

  useEffect(() => {
    if (authentication && !authStatus) {
      navigate("/login", { replace: true });
    }
    if (!authentication && authStatus) {
      navigate("/", { replace: true });
    }
  }, [navigate, authStatus, authentication]);

  if (authStatus === undefined || authStatus === null) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
        <div className="loader"></div>
      </div>
    );
  }

  return <>{children}</>;
}
