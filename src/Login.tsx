import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./redux/store";
import { updateToken } from "./redux/reducer/userReducer";

const Login = () => {
  const navigatePage = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  const { access_token } = useAppSelector((state) => state.user);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (access_token) {
      navigate("/home");
    }
  }, [access_token]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");
    if (token) {
      dispatch(updateToken(token));
      sessionStorage.setItem("token", JSON.stringify(token));
      navigate("/home");
    }
  }, [location.search]);
  return (
    <div className="flex items-center justify-center h-screen dark:bg-gray-800">
      <button
        onClick={navigatePage}
        className="px-4 py-2 border flex gap-2 border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:shadow transition duration-150"
      >
        <img
          className="w-6 h-6"
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          loading="lazy"
          alt="google logo"
        />
        <span>Login with Google</span>
      </button>
    </div>
  );
};

export default Login;
