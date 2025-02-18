import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./redux/store";
import { updateToken } from "./redux/reducer/userReducer";
import CustomInput from "./component/CustomInput";
import { FiLock, FiUser } from "react-icons/fi";
import Button from "./component/CustomButton";

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

  const letMeIn = () => {
    sessionStorage.removeItem("token");
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywiaWF0IjoxNzM0NTM3NjYyLCJleHAiOjE3NjYwNzM2NjJ9.z3_BGfq81PTut8zaBuSg7pQRdae-ZSe5rRtN6zM3TEQ";
    dispatch(updateToken(token));
    sessionStorage.setItem("token", JSON.stringify(token));
    navigate("/home");
  };

  return (
    <>
      <div className="bg-gray-700 w-full h-full overflow-x-hidden overflow-y-auto flex justify-center items-center flex-col font-poppins">
        <div className="w-[80%] max-w-[1000px] bg-gray-100 rounded-[40px] grid grid-cols-12 gap-x-5 p-10">
          <div className="col-span-12 lg:col-span-6 lg:border-e-2 flex justify-center items-center">
            <div className="max-w-full text-center">
              <h1 className="text-[36px] leading-[0.99] font-bold">Talk<span className="text-orange-600">Bro</span></h1>
              <p className="mt-1 text-sm text-gray-400 font-semibold">RELIABLE | FAST | REAL-TIME | SECURE</p>
              <div className="mt-8 w-full">
                <CustomInput prefixIcon={<FiUser className="text-gray-700" />} className="text-gray-50 mb-3" placeholder="Email" />
                <CustomInput prefixIcon={<FiLock className="text-gray-700" />} className="text-gray-50 mb-3" placeholder="Password" />
                <Button variant="dark" className="w-full">Login</Button>
                <hr className="border my-5" />

                <Button icon={<img
                  className="w-6 h-6"
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  loading="lazy"
                  alt="google logo"
                />} onClick={navigatePage} variant="outline" className="w-full">Login with google</Button>
                <div className="flex justify-between mt-3">
                  <p onClick={letMeIn} className="text-[10px] cursor-pointer text-blue-400 hover:underline text-start">Demo Login</p>
                  <p className="text-[10px] cursor-pointer text-blue-400 hover:underline text-start">Forgot Password</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-6 justify-end items-center hidden lg:flex">
            <img className="w-[200px] sm:w-[400px] max-w-full m-0" src="/images/login-page-image.svg" loading="lazy" alt="talkbro" />
          </div>
        </div>
          <p className="mt-2 col-span-12 text-[10px] text-center text-red-500">Note: Our backend is deployed on Render, so please have patience and try again if failed !</p>
      </div>
    </>
  );
};

export default Login;
