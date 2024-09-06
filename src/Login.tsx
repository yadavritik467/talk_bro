import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const Login = () => {
  const navigatePage = () => {
    window.location.href = "http://localhost:4500/auth/google";
  };

  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");
    if (token) {
      sessionStorage.setItem("token", JSON.stringify(token));
    }
  }, [location.search]);
  return (
    <div>
      <button onClick={navigatePage}>Login</button>
    </div>
  );
};

export default Login;
